import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function MainContent() {
  return (
    <div className="p-4">
      <Tabs defaultValue="logs">
        <TabsList>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="effects">Effects</TabsTrigger>
        </TabsList>
        <TabsContent value="logs">
          <div className="mt-4">
            {/* Display logs here */}
            <p>Log output will appear here.</p>
          </div>
        </TabsContent>
        <TabsContent value="effects">
          <div className="mt-4">
            {/* Display effects here */}
            <p>Effects will appear here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}