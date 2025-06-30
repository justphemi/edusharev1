
import { Link } from "react-router-dom";
import { BookOpen, Users, GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Evangel Seminary</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/student/login" className="text-gray-600 hover:text-blue-600 transition-colors">
              Student Portal
            </Link>
            <Link to="/teacher/login" className="text-gray-600 hover:text-blue-600 transition-colors">
              Teacher Portal
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Share Knowledge,
            <span className="text-blue-600"> Build Futures</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            A comprehensive platform connecting students and teachers through shared educational materials. 
            From JSS1 to SS3, discover and contribute to a growing library of learning resources.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <Link to="/student/login">
                <CardHeader className="text-center">
                  <GraduationCap className="h-12 w-12 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <CardTitle className="text-xl">Student Portal</CardTitle>
                  <CardDescription>
                    Access materials for your class level
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full group-hover:bg-blue-700">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <Link to="/teacher/login">
                <CardHeader className="text-center">
                  <Users className="h-12 w-12 text-green-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <CardTitle className="text-xl">Teacher Portal</CardTitle>
                  <CardDescription>
                    Share materials and manage resources
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full group-hover:bg-green-50 group-hover:border-green-600">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Evangel Seminary?
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Organized Materials</h4>
              <p className="text-gray-600">Materials are organized by class levels from JSS1 to SS3 for easy discovery.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Teacher Collaboration</h4>
              <p className="text-gray-600">Teachers can easily share and tag materials for specific class levels.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Student Success</h4>
              <p className="text-gray-600">Students get access to relevant materials tailored to their current class level.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="h-6 w-6" />
            <span className="text-lg font-semibold">Evangel Seminary</span>
          </div>
          <p className="text-gray-400">Empowering education through shared knowledge.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
