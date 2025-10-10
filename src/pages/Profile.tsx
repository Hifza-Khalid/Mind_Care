import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User as UserType } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  GraduationCap,
  Award,
  Shield,
  Edit,
  Save,
  Camera,
  Upload,
  Trash2,
  MoreVertical,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { validateProfileData } from '@/utils/validation';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<UserType>>(user || {});
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({}); 



  useEffect(() => {
    if (user) {
      setEditData(user);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">
            Please log in to view your profile
          </h1>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    // 1. Reset errors at start of save attempt
    setValidationErrors({});
    
    // Check validation. We need to capture errors if it fails.
    const errors = validateProfileData(editData, toast);

    if (errors && typeof errors === 'object' && Object.keys(errors).length > 0) {
      // 2. If errors exist, set the visual error state and STOP saving.
      setValidationErrors(errors as Record<string, boolean>);
      console.log('Validation failed. Stopping save.');
      return;
    }

    // If validation passes, this line runs and updates the state/context.
    updateUser(editData); 
    setIsEditing(false);
    // Clear any persistent errors on successful save
    setValidationErrors({});
    
    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been saved successfully.',
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP).',
        variant: 'destructive',
      });
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: 'File Too Large',
        description: 'Please upload an image smaller than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploadingImage(true);

    const imageUrl = URL.createObjectURL(file);
    
    setTimeout(() => {
      const newEditData = { ...editData, avatar: imageUrl };
      setEditData(newEditData);
      updateUser({ avatar: imageUrl });
      
      setIsUploadingImage(false);
      toast({
        title: 'Profile Picture Updated',
        description: 'Your profile picture has been updated successfully.',
      });
    }, 1500);
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById('profile-image-upload') as HTMLInputElement;
    fileInput?.click();
  };

  const removeProfilePicture = () => {
    const newEditData = { ...editData, avatar: undefined };
    setEditData(newEditData);
    updateUser({ avatar: undefined });
    toast({
      title: 'Profile Picture Removed',
      description: 'Your profile picture has been removed.',
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student':
        return 'bg-blue-500';
      case 'counselor':
        return 'bg-green-500';
      case 'admin':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="relative mx-auto mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={editData.avatar || user.avatar} alt={editData.name || user.name} />
                <AvatarFallback className="text-xl">{getInitials(editData.name || user.name)}</AvatarFallback>
              </Avatar>
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                    disabled={isUploadingImage}
                    title="Change profile picture"
                  >
                    {isUploadingImage ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={triggerFileInput} disabled={isUploadingImage}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload new photo
                  </DropdownMenuItem>
                  {(editData.avatar || user.avatar) && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={removeProfilePicture} disabled={isUploadingImage}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove photo
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardTitle className="text-xl">{user.name}</CardTitle>
            <CardDescription className="flex items-center justify-center space-x-2">
              <Badge className={`${getRoleColor(user.role)} text-white`}>
                {user.role === 'student' && <GraduationCap className="h-3 w-3 mr-1" />}
                {user.role === 'counselor' && <Award className="h-3 w-3 mr-1" />}
                {user.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{user.phone}</span>
              </div>
            )}
            {user.joinDate && (
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detailed Information */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and preferences</CardDescription>
            </div>
            <Button
              variant={isEditing ? 'default' : 'outline'}
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            >
              {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="role-specific">
                  {user.role === 'student'
                    ? 'Academic'
                    : user.role === 'counselor'
                      ? 'Professional'
                      : 'Admin'}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name" type='text'
                      value={isEditing ? editData.name || '' : user.name || ''}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email" type='email'
                      value={isEditing ? editData.email || '' : user.email || ''}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      disabled={!isEditing}
                      className={validationErrors.email ? 'border-red-500 ring-red-500 focus:border-red-500' : ''}
                      placeholder={validationErrors.email ? 'e.g. user@example.com' : ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={isEditing ? editData.dateOfBirth || '' : user.dateOfBirth || ''}
                      onChange={(e) => setEditData({ ...editData, dateOfBirth: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferredLanguage">Preferred Language</Label>
                    <Input
                      id="preferredLanguage"
                      value={
                        isEditing ? editData.preferredLanguage || '' : user.preferredLanguage || ''
                      }
                      onChange={(e) =>
                        setEditData({ ...editData, preferredLanguage: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                {user.timezone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{user.timezone}</span>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="contact" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone" type='tel' maxLength={10}
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault(); 
                        }
                      }}
                      value={isEditing ? editData.phone || '' : user.phone || ''}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      disabled={!isEditing}
                      className={validationErrors.phone ? 'border-red-500 ring-red-500 focus:border-red-500' : ''}
                      placeholder={validationErrors.phone ? 'e.g. 1234567890 (10 digits)' : ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input
                      id="timezone" type='timezone'
                      value={isEditing ? editData.timezone || '' : user.timezone || ''}
                      onChange={(e) => setEditData({ ...editData, timezone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact" type='text'
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      value={
                        isEditing ? editData.emergencyContact || '' : user.emergencyContact || ''
                      }
                      onChange={(e) =>
                        setEditData({ ...editData, emergencyContact: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                    <Input
                      id="emergencyPhone" type='tel' maxLength={10}
                      value={isEditing ? editData.emergencyPhone || '' : user.emergencyPhone || ''}
                      onChange={(e) => setEditData({ ...editData, emergencyPhone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferredLanguage">Preferred Language</Label>
                    <Input
                      id="preferredLanguage"
                      value={
                        isEditing ? editData.preferredLanguage || '' : user.preferredLanguage || ''
                      }
                      onChange={(e) =>
                        setEditData({ ...editData, preferredLanguage: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={isEditing ? editData.phone || '' : user.phone || ''}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input
                      id="timezone"
                      value={isEditing ? editData.timezone || '' : user.timezone || ''}
                      onChange={(e) => setEditData({ ...editData, timezone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      value={
                        isEditing ? editData.emergencyContact || '' : user.emergencyContact || ''
                      }
                      onChange={(e) =>
                        setEditData({ ...editData, emergencyContact: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                    <Input
                      id="emergencyPhone"
                      value={isEditing ? editData.emergencyPhone || '' : user.emergencyPhone || ''}
                      onChange={(e) => setEditData({ ...editData, emergencyPhone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="role-specific" className="space-y-4 mt-6">
                {user.role === 'student' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="university">University</Label>
                      <Input
                        id="university"
                        value={isEditing ? editData.university || '' : user.university || ''}
                        onChange={(e) => setEditData({ ...editData, university: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="major">Major</Label>
                      <Input
                        id="major"
                        value={isEditing ? editData.major || '' : user.major || ''}
                        onChange={(e) => setEditData({ ...editData, major: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Academic Year</Label>
                      <Input
                        id="year" type='year'
                        value={isEditing ? editData.year || '' : user.year || ''}
                        onChange={(e) => setEditData({ ...editData, year: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentId">Student ID</Label>
                      <Input
                        id="studentId" type='id'
                        value={isEditing ? editData.studentId || '' : user.studentId || ''}
                        onChange={(e) => setEditData({ ...editData, studentId: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                )}

                {user.role === 'counselor' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="license">License</Label>
                        <Input
                          id="license"
                          value={isEditing ? editData.license || '' : user.license || ''}
                          onChange={(e) => setEditData({ ...editData, license: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience">Experience</Label>
                        <Input
                          id="experience"
                          value={isEditing ? editData.experience || '' : user.experience || ''}
                          onChange={(e) => setEditData({ ...editData, experience: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Specializations</Label>
                      <div className="flex flex-wrap gap-2">
                        {user.specialization?.map((spec, index) => (
                          <Badge key={index} variant="secondary">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {user.role === 'admin' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={isEditing ? editData.department || '' : user.department || ''}
                        onChange={(e) => setEditData({ ...editData, department: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Permissions</Label>
                      <div className="flex flex-wrap gap-2">
                        {user.permissions?.map((permission, index) => (
                          <Badge key={index} variant="outline">
                            {permission.replace('_', ' ').toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
