"use client";

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
import { Building2, Globe, Linkedin, MapPin, Briefcase } from "lucide-react";
import ConnectPetraWallet from "@/components/tetra";
import { useState, useEffect } from "react";


const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  industry: z.string().min(2, "Industry must be at least 2 characters"),
  website: z.string().url("Please enter a valid URL").optional(),
  about: z.string().min(50, "About section must be at least 50 characters"),
  linkedinUrl: z.string().url("Please enter a valid LinkedIn URL").optional(),
});

export default function ClientProfile() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      company: "",
      location: "",
      industry: "",
      website: "",
      about: "",
      linkedinUrl: "",
    },
  });

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!walletAddress) {
      alert("Please connect your wallet first");
      return;
    }
    const postData = { ...values, walletAddress };

    try {
      const response = await fetch("/api/user/client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      localStorage.setItem("user",JSON.stringify(postData))

      if (response.ok) {
        console.log("Client profile created successfully");
        router.push("/client/dashboard");
      } else {
        console.error("Failed to create client profile");
      }
    } catch (error) {
      console.error("An error occurred while creating client profile", error);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="border border-blue-500/20 glow-effect bg-[#121212]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Create Client Profile
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
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Company Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-blue-500" />
                          <Input
                            placeholder="Acme Corporation"
                            {...field}
                            className="input-glow bg-[#1a1a1a] border-blue-500/20 text-gray-100 pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              placeholder="City, Country"
                              {...field}
                              className="input-glow bg-[#1a1a1a] border-blue-500/20 text-gray-100 pl-10"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Industry</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-2.5 h-5 w-5 text-blue-500" />
                            <Input
                              placeholder="Technology"
                              {...field}
                              className="input-glow bg-[#1a1a1a] border-blue-500/20 text-gray-100 pl-10"
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
                  name="about"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">About Company</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your company and what you're looking for..."
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
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Website</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Globe className="absolute left-3 top-2.5 h-5 w-5 text-blue-500" />
                            <Input
                              className="input-glow bg-[#1a1a1a] border-blue-500/20 text-gray-100 pl-10"
                              placeholder="https://example.com"
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
                              placeholder="https://linkedin.com/company/example"
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