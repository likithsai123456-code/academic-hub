import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, GraduationCap, Calendar, Edit, Save, Camera } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { toast } from "sonner";

export default function StudentProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "John Doe",
    email: user?.email || "student@example.com",
    phone: "+1 (555) 123-4567",
    studentId: "STU2024001",
    department: "Computer Science",
    year: "3rd Year",
    semester: "6th Semester",
    enrollmentDate: "August 2023",
  });

  const initials = formData.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  const handleAvatarChange = () => {
    toast.info("Avatar upload coming soon!");
  };

  return (
    <DashboardLayout role="student" userName={user?.name}>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and preferences.
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Avatar Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" alt={formData.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                  onClick={handleAvatarChange}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <h2 className="mt-4 text-xl font-semibold">{formData.name}</h2>
              <p className="text-sm text-muted-foreground">{formData.studentId}</p>
              <p className="text-sm text-muted-foreground mt-1">{formData.department}</p>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Your personal details and contact information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                ) : (
                  <div className="flex items-center gap-2 h-10 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {formData.name}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center gap-2 h-10 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {formData.email}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                ) : (
                  <div className="flex items-center gap-2 h-10 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {formData.phone}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Student ID</Label>
                <div className="flex items-center gap-2 h-10 text-sm">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  {formData.studentId}
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-4">Academic Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Department</Label>
                  <div className="flex items-center gap-2 h-10 text-sm">
                    {formData.department}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Current Year</Label>
                  <div className="flex items-center gap-2 h-10 text-sm">
                    {formData.year}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Current Semester</Label>
                  <div className="flex items-center gap-2 h-10 text-sm">
                    {formData.semester}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Enrollment Date</Label>
                  <div className="flex items-center gap-2 h-10 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {formData.enrollmentDate}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
