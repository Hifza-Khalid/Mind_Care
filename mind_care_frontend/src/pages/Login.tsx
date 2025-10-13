import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Mail, Lock, User, Shield, GraduationCap, EyeIcon, EyeOffIcon, CheckCircle, X } from 'lucide-react';
import { LoginCredentials } from '@/types/auth';
import PageTransition from '@/components/ui/PageTransition';
import ScrollFadeIn from '@/components/ui/ScrollFadeIn';
import { FaGoogle } from 'react-icons/fa';
import { toast } from '@/components/ui/sonner';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const location = useLocation();

  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
    role: 'student',
  });

  // Store user info in localStorage
  const handleLoginSuccess = (user: { name: string; role: string; token: string }) => {
    localStorage.setItem('userName', user.name);
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('token', user.token);
  };

  // Handle Google OAuth redirect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const name = params.get('name');
    const role = params.get('role');
    const token = params.get('token');
    const error = params.get('error');

    if (error) {
      toast.error(error);
    } else if (name && role && token) {
      handleLoginSuccess({ name, role, token });
      toast.success(`Welcome back, ${name}!`);
      navigate('/'); // redirect to dashboard
    }
  }, [location, navigate]);

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const user = await login(credentials);
      if (user) {
        handleLoginSuccess({
          name: user.name,
          role: user.role,
          token: user.token,
        });

        toast.success('Logged in successfully!');
        navigate('/'); // redirect after login
      } else {
        toast.error('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Login failed. Please try again.');
    }
  };

  const handleRoleChange = (role: 'student' | 'counselor' | 'admin') => {
    const demoCredentials = {
      student: { email: 'student@mindbuddy.com', password: 'student123' },
      counselor: { email: 'counselor@mindbuddy.com', password: 'counselor123' },
      admin: { email: 'admin@mindbuddy.com', password: 'admin123' },
    };
    setCredentials({ ...demoCredentials[role], role });
  };

  const handleGoogleLogin = () => {
    window.open(`http://localhost:5000/auth/google?role=${credentials.role}`, '_self');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student':
        return <GraduationCap className="h-4 w-4" />;
      case 'counselor':
        return <Heart className="h-4 w-4" />;
      case 'admin':
        return <Shield className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'student':
        return 'Access AI support, book sessions, and join peer forums';
      case 'counselor':
        return 'Manage sessions, provide support, and access resources';
      case 'admin':
        return 'View analytics, manage users, and oversee platform';
      default:
        return '';
    }
  };

  // Live password validations
  const password = credentials.password || '';
  const [passwordFocused, setPasswordFocused] = useState(false);
  const passwordValidations = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  return (
    <div className="flex flex-col bg-gradient-calm">
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          
              <div className="text-center space-y-2">
              <Link to="/" className="flex items-center justify-center space-x-2 group">
                <Heart className="h-10 w-10 text-primary group-hover:text-secondary transition-colors" />
                <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  MindBuddy
                </span>
              </Link>
              <p className="text-muted-foreground">Your trusted mental health companion</p>
            </div>
            

            <ScrollFadeIn yOffset={16} delay={0.07}>
              <Card className="shadow-trust">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
                  <CardDescription className="text-center">
                    Choose your role to access your personalized dashboard
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Tabs defaultValue="student" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                      {(['student', 'counselor', 'admin'] as const).map((role) => (
                        <TabsTrigger
                          key={role}
                          value={role}
                          onClick={() => handleRoleChange(role)}
                          className="flex items-center space-x-1"
                        >
                          {getRoleIcon(role)}
                          <span className="hidden sm:inline capitalize">{role}</span>
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {(['student', 'counselor', 'admin'] as const).map((role) => (
                      <TabsContent key={role} value={role} className="space-y-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="flex items-center justify-center space-x-2 mb-1">
                            {getRoleIcon(role)}
                            <span className="font-medium capitalize">{role} Portal</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{getRoleDescription(role)}</p>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>

                  <form onSubmit={handleLogin} className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={credentials.email}
                          onChange={(e) =>
                            setCredentials({ ...credentials, email: e.target.value })
                          }
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={credentials.password}
                        onChange={(e) =>
                            setCredentials({ ...credentials, password: e.target.value })
                          }
                        className="pl-10"
                        required
                        onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                    />
                    <button
                      className="absolute right-4 top-3"
                      onClick={togglePasswordVisibility}
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <EyeIcon className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>

                  {/* Password validation checklist (visible while typing or focused) */}
                  {(passwordFocused || password.length > 0) && (
                    <div className="mt-2 text-sm space-y-1" role="status" aria-live="polite">
                    {(
                      [
                        { key: 'length', label: 'At least 8 characters' },
                        { key: 'uppercase', label: 'An uppercase letter (A-Z)' },
                        { key: 'lowercase', label: 'A lowercase letter (a-z)' },
                        { key: 'number', label: 'A number (0-9)' },
                        { key: 'special', label: 'A special character (!@#$...)' },
                      ] as const
                    ).map((rule) => {
                      const ok = passwordValidations[rule.key as keyof typeof passwordValidations];
                      return (
                        <div key={rule.key} className="flex items-center gap-2">
                          {ok ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-red-400" />
                          )}
                          <span className={`${ok ? 'text-green-600' : 'text-muted-foreground'}`}>
                            {rule.label}
                          </span>
                        </div>
                      );
                    })}
                        </div>
                      )}
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>

                  <Button
                    onClick={handleGoogleLogin}
                    variant="outline"
                    size="lg"
                    className="w-full mt-4 flex items-center justify-center space-x-2"
                  >
                    <FaGoogle className="h-5 w-5" />
                    <span>Sign in with Google</span>
                  </Button>

                <div className="mt-6 text-center text-sm">
                  <span className="text-muted-foreground">Don’t have an account? </span>
                  <Link to="/signup" className="text-primary hover:underline font-medium">
                    Sign up
                  </Link>
                </div>
              </CardContent>
            </Card>
            

          
              <div className="text-center space-y-2 text-sm md:text-base text-muted-foreground">
              <p>🔒 Your privacy is protected with end-to-end encryption</p>
              <p>💬 Confidential support available 24/7</p>
              <p>🏥 HIPAA compliant and stigma-free environment</p>
            </div>
            
        </div>
      </main>
    </div>
  );
};

export default Login;
