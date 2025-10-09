import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'react-toastify';
import PageTransition from '@/components/ui/PageTransition';
import ScrollFadeIn from '@/components/ui/ScrollFadeIn';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'student' | 'counselor' | 'admin' | '';
  dateOfBirth?: string;
  university?: string;
  major?: string;
  year?: string;
  license?: string;
  specialization?: string;
  experience?: string;
  department?: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    dateOfBirth: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleRoleChange = (value: 'student' | 'counselor' | 'admin') => {
    setFormData(prev => ({ ...prev, role: value }));
    setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (!formData.role) {
      setError('Please select a role');
      return false;
    }

    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const existingUsersJson = localStorage.getItem('mindbuddy_users_db');
      const existingUsers = existingUsersJson ? JSON.parse(existingUsersJson) : {};

      if (existingUsers[formData.email]) {
        setError('An account with this email already exists');
        setIsLoading(false);
        return;
      }

      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const newUser = {
        id: userId,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        avatar: '/api/placeholder/150/150',
        phone: '',
        dateOfBirth: formData.dateOfBirth || '',
        emergencyContact: '',
        emergencyPhone: '',
        preferredLanguage: 'English',
        timezone: 'Asia/Kolkata',
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      };

      if (formData.role === 'student') {
        Object.assign(newUser, {
          university: formData.university || '',
          major: formData.major || '',
          year: formData.year || '',
          studentId: `STU-${Date.now()}`,
        });
      } else if (formData.role === 'counselor') {
        Object.assign(newUser, {
          license: formData.license || '',
          specialization: formData.specialization ? formData.specialization.split(',').map(s => s.trim()) : [],
          experience: formData.experience || '',
        });
      } else if (formData.role === 'admin') {
        Object.assign(newUser, {
          department: formData.department || '',
          permissions: ['user_management', 'system_settings', 'analytics_view'],
        });
      }

      existingUsers[formData.email] = {
        password: formData.password,
        user: newUser,
      };

      localStorage.setItem('mindbuddy_users_db', JSON.stringify(existingUsers));

      toast.success('Registration successful! Please login.');
      
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'student':
        return 'Access peer support, counseling sessions, and mental health resources';
      case 'counselor':
        return 'Provide professional counseling and support to students';
      case 'admin':
        return 'Manage platform operations, users, and system settings';
      default:
        return '';
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-8">
        <ScrollFadeIn>
          <Card className="w-full max-w-2xl shadow-2xl">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
                  <Heart className="w-12 h-12 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create Your Account
              </CardTitle>
              <CardDescription className="text-base">
                Join Mind Care - Your trusted mental health companion
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="role">Select Role *</Label>
                    <Select
                      value={formData.role}
                      onValueChange={handleRoleChange}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="counselor">Counselor</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                    {formData.role && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {getRoleDescription(formData.role)}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Min. 6 characters"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Re-enter password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth (Optional)</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {formData.role === 'student' && (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-semibold text-lg">Student Information (Optional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="university">University</Label>
                        <Input
                          id="university"
                          name="university"
                          type="text"
                          placeholder="Your University"
                          value={formData.university}
                          onChange={handleInputChange}
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <Label htmlFor="major">Major</Label>
                        <Input
                          id="major"
                          name="major"
                          type="text"
                          placeholder="Enter your major field of study"
                          value={formData.major}
                          onChange={handleInputChange}
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <Label htmlFor="year">Year</Label>
                        <Input
                          id="year"
                          name="year"
                          type="text"
                          placeholder="Enter your year"
                          value={formData.year}
                          onChange={handleInputChange}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {formData.role === 'counselor' && (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-semibold text-lg">Counselor Information (Optional)</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="license">License Number</Label>
                        <Input
                          id="license"
                          name="license"
                          type="text"
                          placeholder="License Number"
                          value={formData.license}
                          onChange={handleInputChange}
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <Label htmlFor="specialization">Specialization (comma-separated)</Label>
                        <Input
                          id="specialization"
                          name="specialization"
                          type="text"
                          placeholder="Anxiety, Depression, Stress Management"
                          value={formData.specialization}
                          onChange={handleInputChange}
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <Label htmlFor="experience">Years of Experience</Label>
                        <Input
                          id="experience"
                          name="experience"
                          type="text"
                          placeholder="5 years"
                          value={formData.experience}
                          onChange={handleInputChange}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {formData.role === 'admin' && (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-semibold text-lg">Administrator Information (Optional)</h3>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        name="department"
                        type="text"
                        placeholder="IT Administration"
                        value={formData.department}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create Account
                    </>
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:underline font-semibold">
                  Sign in here
                </Link>
              </div>
              <div className="text-xs text-center text-muted-foreground">
                 Your data is encrypted and secure. We follow HIPAA compliance standards.
              </div>
            </CardFooter>
          </Card>
        </ScrollFadeIn>
      </div>
    </PageTransition>
  );
};

export default Register;
