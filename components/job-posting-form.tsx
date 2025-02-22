"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import { mockJobs } from '@/lib/mockData';

const formSchema = z.object({
  category: z.string(),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  milestones: z.array(z.object({
    description: z.string().min(10, 'Milestone description must be at least 10 characters'),
    amount: z.number().min(0, 'Amount must be positive'),
  })).min(1, 'At least one milestone is required'),
  estimatedHours: z.number().min(1, 'Estimated hours must be at least 1'),
});

export default function JobPostingForm() {
  const [milestoneCount, setMilestoneCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
      title: '',
      description: '',
      milestones: [{ description: '', amount: 0 }],
      estimatedHours: 1,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}"); // Parse the user object from localStorage
      if (!user.id) {
        throw new Error("User not found in localStorage");
      }
      const response = await fetch('/api/job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...values, userId: user.id }), // Include userId in the request body
      });
  
      if (!response.ok) {
        throw new Error('Failed to create job');
      }
  
      const newJob = await response.json();
      form.reset();
      setMilestoneCount(1);
      console.log('Job posted:', newJob);
      router.push('/jobs');
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const updateMilestoneCount = (newCount: number) => {
    const count = Math.max(1, newCount);
    const currentMilestones = form.getValues('milestones');
    const newMilestones = Array(count)
      .fill(null)
      .map((_, i) => currentMilestones[i] || { description: '', amount: 0 });
    form.setValue('milestones', newMilestones);
    setMilestoneCount(count);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="glow-effect">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Smart Contracts">Smart Contracts</SelectItem>
                  <SelectItem value="DApp Development">DApp Development</SelectItem>
                  <SelectItem value="Web3 Integration">Web3 Integration</SelectItem>
                  <SelectItem value="Blockchain Infrastructure">Blockchain Infrastructure</SelectItem>
                  <SelectItem value="NFT Development">NFT Development</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter project title" className="glow-effect" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel>Project Description</FormLabel>
          <Tabs defaultValue="write">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="write">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Write your project description in Markdown"
                        className="min-h-[200px] glow-effect"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            <TabsContent value="preview">
              <Card className="p-4 markdown-preview">
                <ReactMarkdown>
                  {form.getValues('description') || 'Nothing to preview'}
                </ReactMarkdown>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <FormLabel>Number of Milestones</FormLabel>
          <Input
            type="number"
            min="1"
            value={milestoneCount.toString()}
            onChange={(e) => updateMilestoneCount(parseInt(e.target.value) || 1)}
            className="glow-effect"
          />
        </div>

        <div className="space-y-4">
          {Array.from({ length: milestoneCount }).map((_, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 p-4 border border-gray-800 rounded-lg">
              <FormField
                control={form.control}
                name={`milestones.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Milestone {index + 1} Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Milestone description" className="glow-effect" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`milestones.${index}.amount`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (ETH)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="glow-effect"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <FormField
          control={form.control}
          name="estimatedHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Hours</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  className="glow-effect"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full glow-effect"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Posting Job...
            </>
          ) : (
            'Post Job'
          )}
        </Button>
      </form>
    </Form>
  );
}