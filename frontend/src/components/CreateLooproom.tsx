import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { looproomApi, categoryApi } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Brain,
  Dumbbell,
  Upload,
  Video,
  FileAudio,
  FileText,
  Image as ImageIcon,
  Plus,
  X,
  Clock,
  Users,
  Star,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface CreateLooproomProps {
  onClose?: () => void;
  onSuccess?: (looproom: any) => void;
}

const THEME_ICONS = {
  recovery: Heart,
  meditation: Brain,
  fitness: Dumbbell
};

const CONTENT_TYPES = [
  { value: 'video', label: 'Video Session', icon: Video },
  { value: 'audio', label: 'Audio Guide', icon: FileAudio },
  { value: 'text', label: 'Written Content', icon: FileText },
  { value: 'live', label: 'Live Session', icon: Users }
];

const DIFFICULTY_LEVELS = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'All Levels'
];

const CreateLooproom: React.FC<CreateLooproomProps> = ({ onClose, onSuccess }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    contentType: 'video',
    contentUrl: '',
    thumbnail: '',
    duration: '',
    difficulty: 'All Levels',
    keywords: [] as string[],
    isPremium: false
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoryApi.getAll();
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };

    loadCategories();
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.categoryId) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const submitData = {
        ...formData,
        duration: formData.duration ? parseInt(formData.duration) : undefined,
        tags,
        keywords: [...formData.keywords, ...tags]
      };

      const response = await looproomApi.create(submitData);

      if (response.success && response.data) {
        if (onSuccess) {
          onSuccess(response.data);
        } else {
          navigate(`/looproom/${response.data.id}`);
        }
      } else {
        setError(response.error || 'Failed to create looproom');
      }
    } catch (err) {
      console.error('Error creating looproom:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedContentType = CONTENT_TYPES.find(type => type.value === formData.contentType);
  const selectedCategory = categories.find(cat => cat.id === formData.categoryId);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-xl rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-foreground flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center mr-3">
                <Plus className="w-5 h-5 text-primary-foreground" />
              </div>
              Create New Looproom
            </CardTitle>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose} className="rounded-xl">
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-foreground font-medium">
                  Looproom Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter a compelling title"
                  className="bg-background/50 border-border/30 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-foreground font-medium">
                  Category *
                </Label>
                <Select value={formData.categoryId} onValueChange={(value) => handleInputChange('categoryId', value)}>
                  <SelectTrigger className="bg-background/50 border-border/30 rounded-xl">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center space-x-2">
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground font-medium">
                Description *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your looproom and what participants can expect"
                className="bg-background/50 border-border/30 rounded-xl min-h-[100px]"
                required
              />
            </div>

            {/* Content Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-foreground font-medium">Content Type</Label>
                <Select value={formData.contentType} onValueChange={(value) => handleInputChange('contentType', value)}>
                  <SelectTrigger className="bg-background/50 border-border/30 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center space-x-2">
                          <type.icon className="w-4 h-4" />
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty" className="text-foreground font-medium">
                  Difficulty Level
                </Label>
                <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                  <SelectTrigger className="bg-background/50 border-border/30 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTY_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contentUrl" className="text-foreground font-medium">
                  Content URL
                </Label>
                <Input
                  id="contentUrl"
                  value={formData.contentUrl}
                  onChange={(e) => handleInputChange('contentUrl', e.target.value)}
                  placeholder="https://..."
                  className="bg-background/50 border-border/30 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="text-foreground font-medium">
                  Duration (minutes)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="30"
                  className="bg-background/50 border-border/30 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail" className="text-foreground font-medium">
                Thumbnail URL
              </Label>
              <Input
                id="thumbnail"
                value={formData.thumbnail}
                onChange={(e) => handleInputChange('thumbnail', e.target.value)}
                placeholder="https://..."
                className="bg-background/50 border-border/30 rounded-xl"
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Tags</Label>
              <div className="flex items-center space-x-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  className="flex-1 bg-background/50 border-border/30 rounded-xl"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm" variant="outline" className="rounded-xl">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center space-x-1 pr-1"
                    >
                      <span>{tag}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTag(tag)}
                        className="h-4 w-4 p-0 hover:bg-destructive/20"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Premium Setting */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div>
                <Label htmlFor="isPremium" className="text-foreground font-medium">
                  Premium Content
                </Label>
                <p className="text-sm text-muted-foreground">
                  Restrict access to premium members only
                </p>
              </div>
              <Switch
                id="isPremium"
                checked={formData.isPremium}
                onCheckedChange={(checked) => handleInputChange('isPremium', checked)}
              />
            </div>

            {/* Preview */}
            {(formData.title || formData.description) && (
              <Card className="bg-muted/30 border-border/30">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                      {selectedContentType && <selectedContentType.icon className="w-6 h-6 text-primary" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground">{formData.title || 'Untitled Looproom'}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {formData.description || 'No description provided'}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        {formData.duration && (
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formData.duration} min
                          </span>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {formData.difficulty}
                        </Badge>
                        {selectedCategory && (
                          <Badge variant="outline" className="text-xs">
                            {selectedCategory.name}
                          </Badge>
                        )}
                        {formData.isPremium && (
                          <Badge className="bg-primary/20 text-primary text-xs">
                            Premium
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border/30">
              {onClose && (
                <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-xl text-primary-foreground shadow-lg min-w-[120px]"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Create Looproom</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateLooproom;