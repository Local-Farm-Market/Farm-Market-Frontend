"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { BarChart3, LineChart, PieChart, Download, Calendar, ArrowUpRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/src/components/ui/select"

interface SalesReportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SalesReportModal({ open, onOpenChange }: SalesReportModalProps) {
  const [dateRange, setDateRange] = useState("month")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BarChart3 className="h-5 w-5 text-amber-600" />
            Sales Report
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-between items-center mb-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {dateRange === "week" && "This Week"}
                  {dateRange === "month" && "This Month"}
                  {dateRange === "quarter" && "This Quarter"}
                  {dateRange === "year" && "This Year"}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-green-800 dark:text-green-300">Total Sales</p>
              <h3 className="text-2xl font-bold text-green-900 dark:text-green-200">$2,450.50</h3>
              <p className="text-xs text-green-700 dark:text-green-400 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" /> +12% from previous period
              </p>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Orders</p>
              <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-200">32</h3>
              <p className="text-xs text-amber-700 dark:text-amber-400 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" /> +8% from previous period
              </p>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Average Order Value</p>
              <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-200">$76.58</h3>
              <p className="text-xs text-blue-700 dark:text-blue-400 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" /> +4% from previous period
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="mb-4 bg-amber-100 dark:bg-amber-950/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Products
            </TabsTrigger>
            <TabsTrigger value="customers" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Customers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-amber-600" />
                  Sales Trend
                </h3>
                <div className="h-64 bg-[url('/placeholder.svg?height=256&width=800')] bg-contain bg-no-repeat bg-center" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-amber-600" />
                    Sales by Category
                  </h3>
                  <div className="h-48 bg-[url('/placeholder.svg?height=192&width=384')] bg-contain bg-no-repeat bg-center" />
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Vegetables</span>
                      </div>
                      <span className="text-sm font-medium">42%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                        <span className="text-sm">Meat & Poultry</span>
                      </div>
                      <span className="text-sm font-medium">28%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Dairy</span>
                      </div>
                      <span className="text-sm font-medium">18%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-sm">Fruits</span>
                      </div>
                      <span className="text-sm font-medium">12%</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-amber-600" />
                    Top Selling Products
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-950/30 rounded-md">
                      <span className="font-medium">Organic Tomatoes</span>
                      <span className="text-green-600 dark:text-green-400">$478.80</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-amber-50 dark:bg-amber-950/30 rounded-md">
                      <span className="font-medium">Grass-Fed Beef</span>
                      <span className="text-green-600 dark:text-green-400">$454.65</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-950/30 rounded-md">
                      <span className="font-medium">Organic Free-Range Eggs</span>
                      <span className="text-green-600 dark:text-green-400">$439.20</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-purple-50 dark:bg-purple-950/30 rounded-md">
                      <span className="font-medium">Fresh Strawberries</span>
                      <span className="text-green-600 dark:text-green-400">$325.50</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-950/30 rounded-md">
                      <span className="font-medium">Organic Spinach</span>
                      <span className="text-green-600 dark:text-green-400">$287.40</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-4">Product Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4 font-medium">Product</th>
                      <th className="text-right py-2 px-4 font-medium">Units Sold</th>
                      <th className="text-right py-2 px-4 font-medium">Revenue</th>
                      <th className="text-right py-2 px-4 font-medium">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 px-4">Organic Tomatoes</td>
                      <td className="text-right py-2 px-4">120</td>
                      <td className="text-right py-2 px-4">$478.80</td>
                      <td className="text-right py-2 px-4 text-green-600">+15%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4">Grass-Fed Beef</td>
                      <td className="text-right py-2 px-4">35</td>
                      <td className="text-right py-2 px-4">$454.65</td>
                      <td className="text-right py-2 px-4 text-green-600">+8%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4">Organic Free-Range Eggs</td>
                      <td className="text-right py-2 px-4">80</td>
                      <td className="text-right py-2 px-4">$439.20</td>
                      <td className="text-right py-2 px-4 text-green-600">+12%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4">Fresh Strawberries</td>
                      <td className="text-right py-2 px-4">65</td>
                      <td className="text-right py-2 px-4">$325.50</td>
                      <td className="text-right py-2 px-4 text-green-600">+20%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4">Organic Spinach</td>
                      <td className="text-right py-2 px-4">96</td>
                      <td className="text-right py-2 px-4">$287.40</td>
                      <td className="text-right py-2 px-4 text-green-600">+5%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4">Organic Carrots</td>
                      <td className="text-right py-2 px-4">110</td>
                      <td className="text-right py-2 px-4">$274.50</td>
                      <td className="text-right py-2 px-4 text-red-600">-3%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4">Organic Apples</td>
                      <td className="text-right py-2 px-4">85</td>
                      <td className="text-right py-2 px-4">$254.15</td>
                      <td className="text-right py-2 px-4 text-green-600">+10%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="customers">
            <div className="space-y-6">
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-4">Customer Demographics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Age Distribution</h4>
                    <div className="h-48 bg-[url('/placeholder.svg?height=192&width=384')] bg-contain bg-no-repeat bg-center" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Location</h4>
                    <div className="h-48 bg-[url('/placeholder.svg?height=192&width=384')] bg-contain bg-no-repeat bg-center" />
                  </div>
                </div>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-4">Top Customers</h3>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4 font-medium">Customer</th>
                        <th className="text-right py-2 px-4 font-medium">Orders</th>
                        <th className="text-right py-2 px-4 font-medium">Total Spent</th>
                        <th className="text-right py-2 px-4 font-medium">Last Order</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 px-4">John Smith</td>
                        <td className="text-right py-2 px-4">8</td>
                        <td className="text-right py-2 px-4">$245.60</td>
                        <td className="text-right py-2 px-4">2 days ago</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4">Sarah Johnson</td>
                        <td className="text-right py-2 px-4">6</td>
                        <td className="text-right py-2 px-4">$198.75</td>
                        <td className="text-right py-2 px-4">1 week ago</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4">Michael Brown</td>
                        <td className="text-right py-2 px-4">5</td>
                        <td className="text-right py-2 px-4">$187.20</td>
                        <td className="text-right py-2 px-4">3 days ago</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4">Emily Davis</td>
                        <td className="text-right py-2 px-4">4</td>
                        <td className="text-right py-2 px-4">$156.40</td>
                        <td className="text-right py-2 px-4">5 days ago</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-4">Robert Wilson</td>
                        <td className="text-right py-2 px-4">4</td>
                        <td className="text-right py-2 px-4">$142.90</td>
                        <td className="text-right py-2 px-4">2 weeks ago</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button onClick={() => onOpenChange(false)}>Close Report</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

