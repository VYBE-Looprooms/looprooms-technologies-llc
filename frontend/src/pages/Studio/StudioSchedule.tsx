import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Video,
  Plus,
  Eye,
  EyeOff,
  Shield,
  Repeat,
  Save,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ScheduleForm {
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  duration: number;
  maxParticipants: number;
  allowAnonymous: boolean;
  requiresApproval: boolean;
  isRecorded: boolean;
  isRecurring: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  tags: string[];
}

const categories = [
  { value: 'recovery', label: 'Recovery', color: 'text-red-600 bg-red-50 border-red-200' },
  { value: 'meditation', label: 'Meditation', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { value: 'fitness', label: 'Fitness', color: 'text-green-600 bg-green-50 border-green-200' }
];

const StudioSchedule: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<ScheduleForm>({
    title: '',
    description: '',
    category: 'meditation',
    date: '',
    time: '',
    duration: 30,
    maxParticipants: 30,
    allowAnonymous: true,
    requiresApproval: false,
    isRecorded: false,
    isRecurring: false,
    tags: []
  });

  const updateForm = (field: keyof ScheduleForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement actual session scheduling API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaved(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Failed to schedule session:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTag = (tag: string) => {
    if (tag && !form.tags.includes(tag)) {
      updateForm('tags', [...form.tags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateForm('tags', form.tags.filter(tag => tag !== tagToRemove));
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // Minimum 30 minutes in the future
    return now.toISOString().slice(0, 16);
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
                Back to Studio
              </Button>
              <h1 className="text-2xl font-bold text-foreground">Schedule Session</h1>
            </div>
            <Button
              type="submit"
              form="schedule-form"
              disabled={loading || saved || !form.title || !form.date || !form.time}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-xl"
            >
              {saved ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Scheduled!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Scheduling...' : 'Schedule Session'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <form id="schedule-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/20 rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Video className="w-5 h-5" />
                <span>Session Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Session Title *</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => updateForm('title', e.target.value)}
                    placeholder="e.g., Morning Mindfulness Meditation"
                    className="mt-1"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => updateForm('description', e.target.value)}
                    placeholder="Describe what participants can expect from this session..."
                    className="mt-1 resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={form.category}
                    onChange={(e) => updateForm('category', e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={form.duration}
                    onChange={(e) => updateForm('duration', parseInt(e.target.value))}
                    min="15"
                    max="180"
                    step="15"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scheduling */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/20 rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>When</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={(e) => updateForm('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={form.time}
                    onChange={(e) => updateForm('time', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Switch
                  id="recurring"
                  checked={form.isRecurring}
                  onCheckedChange={(checked) => updateForm('isRecurring', checked)}
                />
                <div className="flex-1">
                  <Label htmlFor="recurring">Recurring Session</Label>
                  <p className="text-sm text-muted-foreground">Create a repeating session series</p>
                </div>
                <Repeat className="w-4 h-4 text-muted-foreground" />
              </div>

              {form.isRecurring && (
                <div>
                  <Label htmlFor="recurring-pattern">Repeat Pattern</Label>
                  <select
                    id="recurring-pattern"
                    value={form.recurringPattern || 'weekly'}
                    onChange={(e) => updateForm('recurringPattern', e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Participant Settings */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/20 rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Participants</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="maxParticipants">Maximum Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={form.maxParticipants}
                  onChange={(e) => updateForm('maxParticipants', parseInt(e.target.value))}
                  min="1"
                  max="100"
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Recommended: 15-30 participants for interactive sessions
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Switch
                    id="anonymous"
                    checked={form.allowAnonymous}
                    onCheckedChange={(checked) => updateForm('allowAnonymous', checked)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="anonymous">Allow Anonymous Participation</Label>
                    <p className="text-sm text-muted-foreground">
                      Particularly important for recovery sessions
                    </p>
                  </div>
                  {form.allowAnonymous ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <Switch
                    id="approval"
                    checked={form.requiresApproval}
                    onCheckedChange={(checked) => updateForm('requiresApproval', checked)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="approval">Require Approval to Join</Label>
                    <p className="text-sm text-muted-foreground">
                      Manually approve participants before they can join
                    </p>
                  </div>
                  <Shield className="w-4 h-4 text-muted-foreground" />
                </div>

                <div className="flex items-center space-x-3">
                  <Switch
                    id="recording"
                    checked={form.isRecorded}
                    onCheckedChange={(checked) => updateForm('isRecorded', checked)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="recording">Record Session</Label>
                    <p className="text-sm text-muted-foreground">
                      Make recording available to participants after the session
                    </p>
                  </div>
                  <Video className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/20 rounded-2xl">
            <CardHeader>
              <CardTitle>Tags (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {form.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/20 text-primary border border-primary/30"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:text-primary/80"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full border-dashed"
                  onClick={() => {
                    const tag = prompt('Enter a tag:');
                    if (tag) addTag(tag);
                  }}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Tag
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Tags help participants find your session. Examples: beginner, breathing, anxiety, stress-relief
              </p>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/20 rounded-2xl">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border border-border/30 rounded-xl bg-muted/20">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">
                      {form.title || 'Session Title'}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {form.description || 'Session description will appear here...'}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    categories.find(c => c.value === form.category)?.color || 'text-gray-600 bg-gray-50'
                  }`}>
                    {categories.find(c => c.value === form.category)?.label}
                  </span>
                </div>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {form.date ? new Date(form.date + 'T' + (form.time || '00:00')).toLocaleDateString() : 'Date not set'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{form.duration} minutes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>Max {form.maxParticipants}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default StudioSchedule;