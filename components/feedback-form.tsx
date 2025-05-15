"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase/client"
import type { Severity, TestingDevice, Feedback } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LucideAlertCircle, LucideCheck, LucideLoader2, LucideChevronsUpDown } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { getAllFeedback } from "@/lib/data"

// Fallback implementation for Pages Router
async function submitFeedbackClient(formData: any) {
  try {
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, message: "You must be logged in to submit feedback" }
    }

    // Generate a serial number (simplified for client-side)
    const serial_number = `BUG-${Date.now().toString().substring(7)}`

    // Handle file upload if there's a screenshot
    let screenshot_url = null
    if (formData.screenshot) {
      const file = formData.screenshot
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase.storage.from("screenshots").upload(fileName, file)

      if (uploadError) {
        console.error("Error uploading file:", uploadError)
        return { success: false, message: "Error uploading screenshot" }
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("screenshots").getPublicUrl(fileName)

      screenshot_url = publicUrl
    }

    // Insert the feedback into the database
    const { data, error } = await supabase
      .from("feedback")
      .insert({
        serial_number,
        defect_description: formData.defect_description,
        precondition: formData.precondition,
        steps_to_recreate: formData.steps_to_recreate,
        expected_result: formData.expected_result,
        actual_result: formData.actual_result,
        severity: formData.severity,
        testing_device: formData.testing_device,
        screenshot_url,

        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,
        profession: formData.profession,
        location: formData.location,
        most_useful_feature: formData.most_useful_feature,
        chatbot_rating: formData.chatbot_rating,
        parent_serial_number: formData.parent_serial_number,

        created_by: user.id,
        status: "open",
      })
      .select("id")
      .single()

    if (error) {
      console.error("Error inserting feedback:", error)
      return { success: false, message: "Error submitting feedback" }
    }

    return {
      success: true,
      message: `Feedback submitted successfully with ID: ${serial_number}`,
      id: data.id,
    }
  } catch (error) {
    console.error("Error in submitFeedbackClient:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}

export function FeedbackForm() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("defect")
  const [screenshot, setScreenshot] = useState<File | null>(null)

  // Form state
  const [defectDescription, setDefectDescription] = useState("")
  const [precondition, setPrecondition] = useState("")
  const [stepsToRecreate, setStepsToRecreate] = useState("")
  const [expectedResult, setExpectedResult] = useState("")
  const [actualResult, setActualResult] = useState("")
  const [severity, setSeverity] = useState<Severity>("Medium")
  const [testingDevice, setTestingDevice] = useState<TestingDevice>("Desktop")
  const [parentSerialNumber, setParentSerialNumber] = useState("")

  // User information
  const [name, setName] = useState(user?.user_metadata?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [profession, setProfession] = useState("")
  const [location, setLocation] = useState("")
  const [mostUsefulFeature, setMostUsefulFeature] = useState("")
  const [chatbotRating, setChatbotRating] = useState(3)

  const [open, setOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<Feedback[]>([])
  const [searchValue, setSearchValue] = useState("")

  // Load feedback for search
  useEffect(() => {
    const loadFeedback = async () => {
      const feedback = await getAllFeedback()
      setSearchResults(feedback)
    }
    loadFeedback()
  }, [])

  // Filter feedback based on search
  const filteredFeedback = searchResults.filter((feedback) =>
    feedback.serial_number.toLowerCase().includes(searchValue.toLowerCase()) ||
    feedback.defect_description.toLowerCase().includes(searchValue.toLowerCase())
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setScreenshot(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit feedback.",
        variant: "destructive",
      })
      router.push("/auth")
      return
    }

    setIsLoading(true)

    try {
      const formData = {
        defect_description: defectDescription,
        precondition,
        steps_to_recreate: stepsToRecreate,
        expected_result: expectedResult,
        actual_result: actualResult,
        severity,
        testing_device: testingDevice,
        screenshot,

        name,
        email,
        phone_number: phoneNumber,
        profession,
        location,
        most_useful_feature: mostUsefulFeature,
        chatbot_rating: chatbotRating,
        parent_serial_number: parentSerialNumber,
        serial_number: "TEMP-CLIENT",
      }

      // Try to import the server action
      let result
      try {
        const { submitFeedback } = await import("@/app/actions")
        result = await submitFeedback(formData)
      } catch (error) {
        // Fallback to client-side implementation if server action is not available
        console.warn("Server action not available, using client-side implementation")
        result = await submitFeedbackClient(formData)
      }

      if (result.success) {
        toast({
          title: "Feedback submitted",
          description: result.message,
        })

        // Reset form
        setDefectDescription("")
        setPrecondition("")
        setStepsToRecreate("")
        setExpectedResult("")
        setActualResult("")
        setSeverity("Medium")
        setTestingDevice("Desktop")
        setScreenshot(null)
        setPhoneNumber("")
        setProfession("")
        setLocation("")
        setMostUsefulFeature("")
        setChatbotRating(3)
        setParentSerialNumber("")

        // Redirect to the feedback detail page if ID is available
        if (result.id) {
          router.push(`/feedback/${result.id}`)
        }
      } else {
        toast({
          title: "Error submitting feedback",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error submitting feedback",
        description: "An error occurred while submitting your feedback. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const goToNextTab = () => {
    if (activeTab === "defect") setActiveTab("user")
    else if (activeTab === "user") setActiveTab("platform")
  }

  const goToPreviousTab = () => {
    if (activeTab === "platform") setActiveTab("user")
    else if (activeTab === "user") setActiveTab("defect")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Submit Feedback</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="defect" className="flex items-center gap-2">
                <LucideAlertCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Defect Info</span>
              </TabsTrigger>
              <TabsTrigger value="user" className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-user"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="hidden sm:inline">Your Info</span>
              </TabsTrigger>
              <TabsTrigger value="platform" className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-star"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span className="hidden sm:inline">Platform Rating</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="defect" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defectDescription">Defect Description</Label>
                <Textarea
                  id="defectDescription"
                  placeholder="Provide a clear and concise description of the issue"
                  value={defectDescription}
                  onChange={(e) => setDefectDescription(e.target.value)}
                  required
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Parent Serial Number (if this is a refix or related issue)</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      {parentSerialNumber || "Search for parent feedback..."}
                      <LucideChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput 
                        placeholder="Search feedback by serial number or description..."
                        value={searchValue}
                        onValueChange={setSearchValue}
                      />
                      <CommandEmpty>No feedback found.</CommandEmpty>
                      <CommandGroup>
                        {filteredFeedback.map((feedback) => (
                          <CommandItem
                            key={feedback.id}
                            value={feedback.serial_number}
                            onSelect={(currentValue) => {
                              setParentSerialNumber(currentValue)
                              setOpen(false)
                            }}
                          >
                            <LucideCheck
                              className={cn(
                                "mr-2 h-4 w-4",
                                parentSerialNumber === feedback.serial_number ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">{feedback.serial_number}</span>
                              <span className="text-sm text-muted-foreground line-clamp-1">
                                {feedback.defect_description}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="precondition">Precondition</Label>
                  <Textarea
                    id="precondition"
                    placeholder="What conditions were in place before the issue occurred?"
                    value={precondition}
                    onChange={(e) => setPrecondition(e.target.value)}
                    required
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="severity">Severity & Device</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Select value={severity} onValueChange={(value) => setSeverity(value as Severity)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={testingDevice} onValueChange={(value) => setTestingDevice(value as TestingDevice)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select device" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mobile">Mobile</SelectItem>
                        <SelectItem value="Desktop">Desktop</SelectItem>
                        <SelectItem value="Tablet">Tablet</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stepsToRecreate">Steps to Recreate</Label>
                <Textarea
                  id="stepsToRecreate"
                  placeholder="List the steps to reproduce this issue (one step per line)"
                  value={stepsToRecreate}
                  onChange={(e) => setStepsToRecreate(e.target.value)}
                  required
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expectedResult">Expected Result</Label>
                  <Textarea
                    id="expectedResult"
                    placeholder="What should have happened?"
                    value={expectedResult}
                    onChange={(e) => setExpectedResult(e.target.value)}
                    required
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actualResult">Actual Result</Label>
                  <Textarea
                    id="actualResult"
                    placeholder="What actually happened?"
                    value={actualResult}
                    onChange={(e) => setActualResult(e.target.value)}
                    required
                    rows={2}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="screenshot">Screenshot/Evidence</Label>
                <Input
                  id="screenshot"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={goToNextTab}>
                  Next
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="user" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="Your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profession">Profession</Label>
                  <Input
                    id="profession"
                    placeholder="Your profession"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Your location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={goToPreviousTab}>
                  Previous
                </Button>
                <Button type="button" onClick={goToNextTab}>
                  Next
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="platform" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mostUsefulFeature">Most Useful Feature</Label>
                <Input
                  id="mostUsefulFeature"
                  placeholder="What feature do you find most useful?"
                  value={mostUsefulFeature}
                  onChange={(e) => setMostUsefulFeature(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Chatbot Helpfulness Rating</Label>
                <div className="flex justify-center py-4">
                  <RadioGroup
                    value={chatbotRating.toString()}
                    onValueChange={(value) => setChatbotRating(Number.parseInt(value))}
                    className="flex space-x-4"
                  >
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <div key={rating} className="flex flex-col items-center space-y-2">
                        <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} className="sr-only" />
                        <Label
                          htmlFor={`rating-${rating}`}
                          className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-lg font-medium transition-colors
                            ${
                              Number(chatbotRating) === rating
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted hover:bg-muted/80"
                            }`}
                        >
                          {rating}
                        </Label>
                        <span className="text-xs text-muted-foreground">
                          {rating === 1
                            ? "Poor"
                            : rating === 2
                              ? "Fair"
                              : rating === 3
                                ? "Good"
                                : rating === 4
                                  ? "Great"
                                  : "Excellent"}
                        </span>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  On a scale of 1-5, how helpful was the chatbot?
                </p>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={goToPreviousTab}>
                  Previous
                </Button>
                <Button type="submit" disabled={isLoading} className="gap-2">
                  {isLoading ? (
                    <>
                      <LucideLoader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <LucideCheck className="h-4 w-4" />
                      Submit Feedback
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          {!user && (
            <p className="text-sm text-muted-foreground">
              <Button variant="link" className="h-auto p-0" asChild>
                <a href="/auth">Sign in</a>
              </Button>{" "}
              to submit feedback
            </p>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}
