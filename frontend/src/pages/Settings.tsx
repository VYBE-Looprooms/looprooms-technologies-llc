import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  User,
  Bell,
  Shield,
  Eye,
  Smartphone,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  ArrowLeft,
  Save,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface SettingsData {
  notifications: {
    pushEnabled: boolean;
    emailEnabled: boolean;
    sessionReminders: boolean;
    weeklyDigest: boolean;
    socialUpdates: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    allowDirectMessages: boolean;
    showProgress: boolean;
    showStats: boolean;
    allowAnonymous: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    soundEnabled: boolean;
  };
  profile: {
    displayName: string;
    bio: string;
    email: string;
  };
}

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState<SettingsData>({
    notifications: {
      pushEnabled: true,
      emailEnabled: true,
      sessionReminders: true,
      weeklyDigest: false,
      socialUpdates: true,
    },
    privacy: {
      profileVisibility: 'public',
      allowDirectMessages: true,
      showProgress: true,
      showStats: true,
      allowAnonymous: true,
    },
    appearance: {
      theme: 'auto',
      soundEnabled: true,
    },
    profile: {
      displayName: user?.profile?.displayName || user?.username || '',
      bio: user?.profile?.bio || '',
      email: user?.email || '',
    }
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Implement actual settings save API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = (section: keyof SettingsData, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            </div>
            <Button
              onClick={handleSave}
              disabled={loading || saved}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-xl"
            >
              {saved ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Settings */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/20 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                {user?.profile?.avatarUrl ? (
                  <AvatarImage src={user.profile.avatarUrl} alt={settings.profile.displayName} />
                ) : (
                  <AvatarFallback className="bg-primary/20 text-primary font-semibold text-lg">
                    {settings.profile.displayName.charAt(0) || 'U'}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={settings.profile.displayName}
                  onChange={(e) => updateSettings('profile', 'displayName', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={settings.profile.bio}
                onChange={(e) => updateSettings('profile', 'bio', e.target.value)}
                placeholder="Tell others about your VYBE journey..."
                className="mt-1 resize-none"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.profile.email}
                onChange={(e) => updateSettings('profile', 'email', e.target.value)}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/20 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
              </div>
              <Switch
                checked={settings.notifications.pushEnabled}
                onCheckedChange={(checked) => updateSettings('notifications', 'pushEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive email updates and reminders</p>
              </div>
              <Switch
                checked={settings.notifications.emailEnabled}
                onCheckedChange={(checked) => updateSettings('notifications', 'emailEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Session Reminders</Label>
                <p className="text-sm text-muted-foreground">Get reminders for upcoming Looproom sessions</p>
              </div>
              <Switch
                checked={settings.notifications.sessionReminders}
                onCheckedChange={(checked) => updateSettings('notifications', 'sessionReminders', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Weekly Digest</Label>
                <p className="text-sm text-muted-foreground">Weekly summary of your progress and community highlights</p>
              </div>
              <Switch
                checked={settings.notifications.weeklyDigest}
                onCheckedChange={(checked) => updateSettings('notifications', 'weeklyDigest', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Social Updates</Label>
                <p className="text-sm text-muted-foreground">Notifications for reactions and comments on your VYBEs</p>
              </div>
              <Switch
                checked={settings.notifications.socialUpdates}
                onCheckedChange={(checked) => updateSettings('notifications', 'socialUpdates', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Safety */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/20 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Privacy & Safety</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Profile Visibility</Label>
                <p className="text-sm text-muted-foreground">Who can see your profile and activity</p>
              </div>
              <select
                value={settings.privacy.profileVisibility}
                onChange={(e) => updateSettings('privacy', 'profileVisibility', e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-background text-foreground"
              >
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Direct Messages</Label>
                <p className="text-sm text-muted-foreground">Allow others to send you direct messages</p>
              </div>
              <Switch
                checked={settings.privacy.allowDirectMessages}
                onCheckedChange={(checked) => updateSettings('privacy', 'allowDirectMessages', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Show Progress</Label>
                <p className="text-sm text-muted-foreground">Display your journey progress publicly</p>
              </div>
              <Switch
                checked={settings.privacy.showProgress}
                onCheckedChange={(checked) => updateSettings('privacy', 'showProgress', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Show Statistics</Label>
                <p className="text-sm text-muted-foreground">Display your streak and completion stats</p>
              </div>
              <Switch
                checked={settings.privacy.showStats}
                onCheckedChange={(checked) => updateSettings('privacy', 'showStats', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Anonymous Mode</Label>
                <p className="text-sm text-muted-foreground">Allow participation in recovery sessions anonymously</p>
              </div>
              <Switch
                checked={settings.privacy.allowAnonymous}
                onCheckedChange={(checked) => updateSettings('privacy', 'allowAnonymous', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/20 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Appearance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Theme</Label>
                <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
              </div>
              <select
                value={settings.appearance.theme}
                onChange={(e) => updateSettings('appearance', 'theme', e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-background text-foreground"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Sound Effects</Label>
                <p className="text-sm text-muted-foreground">Enable sound effects and notification sounds</p>
              </div>
              <Switch
                checked={settings.appearance.soundEnabled}
                onCheckedChange={(checked) => updateSettings('appearance', 'soundEnabled', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;