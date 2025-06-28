
import { useState } from "react";
import { BookOpen, Download, Search, Filter, FileText, Video, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const StudentDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");

  // Mock data - this would come from Supabase in a real implementation
  const mockMaterials = [
    {
      id: 1,
      title: "Introduction to Algebra",
      subject: "Mathematics",
      classLevel: "jss1",
      type: "document",
      uploadedBy: "Mrs. Johnson",
      uploadDate: "2024-01-15",
      description: "Basic algebraic concepts and equations"
    },
    {
      id: 2,
      title: "English Grammar Fundamentals",
      subject: "English",
      classLevel: "jss1",
      type: "document",
      uploadedBy: "Mr. Smith",
      uploadDate: "2024-01-14",
      description: "Parts of speech and sentence structure"
    },
    {
      id: 3,
      title: "Basic Chemistry Lab Safety",
      subject: "Chemistry",
      classLevel: "ss1",
      type: "video",
      uploadedBy: "Dr. Williams",
      uploadDate: "2024-01-13",
      description: "Safety procedures in the chemistry laboratory"
    },
    {
      id: 4,
      title: "World War II Timeline",
      subject: "History",
      classLevel: "ss2",
      type: "image",
      uploadedBy: "Prof. Davis",
      uploadDate: "2024-01-12",
      description: "Visual timeline of major WWII events"
    }
  ];

  const classLevels = [
    { value: "all", label: "All Classes" },
    { value: "jss1", label: "JSS 1" },
    { value: "jss2", label: "JSS 2" },
    { value: "jss3", label: "JSS 3" },
    { value: "ss1", label: "SS 1" },
    { value: "ss2", label: "SS 2" },
    { value: "ss3", label: "SS 3" }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-5 w-5 text-blue-600" />;
      case "video":
        return <Video className="h-5 w-5 text-green-600" />;
      case "image":
        return <Image className="h-5 w-5 text-purple-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const filteredMaterials = mockMaterials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === "all" || material.classLevel === selectedClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Portal</h1>
                <p className="text-sm text-gray-600">Welcome back, Student!</p>
              </div>
            </div>
            <Button variant="outline">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search materials by title or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {classLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Materials Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getFileIcon(material.type)}
                    <CardTitle className="text-lg">{material.title}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {material.classLevel.toUpperCase()}
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  {material.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span><strong>Subject:</strong> {material.subject}</span>
                    <span><strong>Type:</strong> {material.type}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p><strong>Uploaded by:</strong> {material.uploadedBy}</p>
                    <p><strong>Date:</strong> {new Date(material.uploadDate).toLocaleDateString()}</p>
                  </div>
                  <Button className="w-full" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Material
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or class filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
