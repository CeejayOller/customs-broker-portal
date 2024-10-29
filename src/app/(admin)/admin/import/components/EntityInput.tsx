// src/app/(admin)/admin/import/components/EntityInput.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { CustomEntity } from '../types/import-form';

interface EntityInputProps {
  type: 'consignee' | 'exporter';
  value: CustomEntity;
  onChange: (value: CustomEntity) => void;
  onSave?: () => void;
  savedEntries: CustomEntity[];
  onSelectSaved: (entry: CustomEntity) => void;
}

export const EntityInput: React.FC<EntityInputProps> = ({
  type,
  value,
  onChange,
  savedEntries,
  onSelectSaved
}) => {
  const [isManual, setIsManual] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const response = await fetch('/api/admin/saved-entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          entity: value,
        }),
      });

      if (!response.ok) throw new Error('Failed to save');

      toast({
        title: 'Success',
        description: `${type === 'consignee' ? 'Consignee' : 'Exporter'} saved successfully`,
      });
      setIsSaveDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">
          {type === 'consignee' ? 'Consignee' : 'Exporter'} Details
        </Label>
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsManual(!isManual)}
          >
            {isManual ? 'Select Saved' : 'Enter Manually'}
          </Button>
          {isManual && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsSaveDialogOpen(true)}
            >
              <Save className="w-4 h-4 mr-1" />
              Save for Later
            </Button>
          )}
        </div>
      </div>

      {isManual ? (
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
          <div>
            <Label>Name</Label>
            <Input
              placeholder={`Enter ${type} name`}
              value={value.name}
              onChange={(e) => onChange({ ...value, name: e.target.value })}
            />
          </div>
          <div>
            <Label>Address</Label>
            <Input
              placeholder={`Enter ${type} address`}
              value={value.address}
              onChange={(e) => onChange({ ...value, address: e.target.value })}
            />
          </div>
          {type === 'consignee' && (
            <>
              <div>
                <Label>TIN</Label>
                <Input
                  placeholder="Enter TIN"
                  value={value.tin || ''}
                  onChange={(e) => onChange({ ...value, tin: e.target.value })}
                />
              </div>
              <div>
                <Label>BRN</Label>
                <Input
                  placeholder="Enter BRN"
                  value={value.brn || ''}
                  onChange={(e) => onChange({ ...value, brn: e.target.value })}
                />
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <Select
            value={value.name}
            onValueChange={(selectedName) => {
              const selected = savedEntries.find(entry => entry.name === selectedName);
              if (selected) {
                onSelectSaved(selected);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${type}`} />
            </SelectTrigger>
            <SelectContent>
              {savedEntries.map((entry, index) => (
                <SelectItem key={index} value={entry.name}>
                  {entry.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="text-sm text-gray-500">
            <p><strong>Address:</strong> {value.address}</p>
            {type === 'consignee' && (
              <>
                <p><strong>TIN:</strong> {value.tin}</p>
                <p><strong>BRN:</strong> {value.brn}</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Save Dialog */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save {type === 'consignee' ? 'Consignee' : 'Exporter'}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Save these details for future use?</p>
            <div className="mt-4 space-y-2 text-sm">
              <p><strong>Name:</strong> {value.name}</p>
              <p><strong>Address:</strong> {value.address}</p>
              {type === 'consignee' && (
                <>
                  <p><strong>TIN:</strong> {value.tin}</p>
                  <p><strong>BRN:</strong> {value.brn}</p>
                </>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};