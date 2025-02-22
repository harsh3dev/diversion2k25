"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Linkedin, DollarSign, MapPin } from "lucide-react";
import ConnectPetraWallet from "@/components/tetra";


const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  imageUrl: z.string().url("Please enter a valid URL").optional(),
  about: z.string().min(50, "About section must be at least 50 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  hourlyRate: z.number().min(1, "Hourly rate must be at least 1"),
  languages: z.string().transform((str) => str.split(",").map((s) => s.trim())),
  githubUrl: z.string().url("Please enter a valid GitHub URL").optional(),
  linkedinUrl: z.string().url("Please enter a valid LinkedIn URL").optional(),
});

export default function Home() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedWalletAddress = localStorage.getItem("walletAddress");
    if (storedWalletAddress) {
      setIsWalletConnected(true);
      setWalletAddress(storedWalletAddress);
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
      about: "",
      location: "",
      hourlyRate: 0,
      languages: [],
      githubUrl: "",
      linkedinUrl: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!walletAddress) {
      alert("Please connect your wallet first");
      return;
    }
    const postData = { ...values, walletAddress };

    try {
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        console.log("Freelancer profile created successfully");
        router.push("/jobs");
      } else {
        console.error("Failed to create freelancer profile");
      }
    } catch (error) {
      console.error("An error occurred while creating freelancer profile", error);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="border border-blue-500/20 glow-effect bg-[#121212]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Create Freelancer Profile
            </CardTitle>
            <ConnectPetraWallet isConnected={isWalletConnected} setIsConnected={setIsWalletConnected} />
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          className="input-glow bg-[#1a1a1a] border-blue-500/20 text-gray-100"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Profile Image URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          {...field}
                          className="input-glow bg-[#1a1a1a] border-blue-500/20 text-gray-100"
                        />
                      </FormControl>
                      <FormDescription className="text-gray-400">
                        Provide a URL to your professional photo
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="about"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">About</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about yourself and your expertise..."
                          className="input-glow bg-[#1a1a1a] border-blue-500/20 text-gray-100 h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="hourlyRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Hourly Rate ($)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-blue-500" />
                            <Input
                              type="number"
                              className="input-glow bg-[#1a1a1a] border-blue-500/20 text-gray-100 pl-10"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-blue-500" />
                          <Input
                            className="input-glow bg-[#1a1a1a] border-blue-500/20 text-gray-100 pl-10"
                            placeholder="City, Country"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="languages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Languages</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="English, Spanish, French"
                          {...field}
                          className="input-glow bg-[#1a1a1a] border-blue-500/20 text-gray-100"
                        />
                      </FormControl>
                      <FormDescription className="text-gray-400">
                        Enter languages separated by commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="githubUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">GitHub Profile</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Github className="absolute left-3 top-2.5 h-5 w-5 text-blue-500" />
                            <Input
                              className="input-glow bg-[#1a1a1a] border-blue-500/20 text-gray-100 pl-10"
                              placeholder="https://github.com/username"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="linkedinUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">LinkedIn Profile</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Linkedin className="absolute left-3 top-2.5 h-5 w-5 text-blue-500" />
                            <Input
                              className="input-glow bg-[#1a1a1a] border-blue-500/20 text-gray-100 pl-10"
                              placeholder="https://linkedin.com/in/username"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={!isWalletConnected}
                  className="w-full bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-semibold glow-effect"
                >
                  {form.formState.isSubmitting ? "Creating Profile..." : "Create Profile"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}