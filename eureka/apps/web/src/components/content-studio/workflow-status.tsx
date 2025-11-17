'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Eye,
  CheckCircle,
  Send,
  Archive,
  AlertCircle,
  Clock,
  ChevronRight
} from 'lucide-react';

export enum WorkflowStatus {
  DRAFT = 'draft',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

interface WorkflowStatusProps {
  currentStatus: WorkflowStatus;
  contentId?: string;
  onStatusChange?: (newStatus: WorkflowStatus) => void;
  disabled?: boolean;
}

const statusConfig = {
  [WorkflowStatus.DRAFT]: {
    label: 'Draft',
    color: 'bg-gray-500',
    icon: FileText,
    description: 'Content is in draft mode and can be edited freely',
  },
  [WorkflowStatus.IN_REVIEW]: {
    label: 'In Review',
    color: 'bg-blue-500',
    icon: Eye,
    description: 'Content is being reviewed by subject matter experts',
  },
  [WorkflowStatus.APPROVED]: {
    label: 'Approved',
    color: 'bg-green-500',
    icon: CheckCircle,
    description: 'Content has been approved and is ready to publish',
  },
  [WorkflowStatus.PUBLISHED]: {
    label: 'Published',
    color: 'bg-purple-500',
    icon: Send,
    description: 'Content is live and accessible to students',
  },
  [WorkflowStatus.ARCHIVED]: {
    label: 'Archived',
    color: 'bg-orange-500',
    icon: Archive,
    description: 'Content has been archived and is no longer active',
  },
};

// Valid workflow transitions
const validTransitions: Record<WorkflowStatus, WorkflowStatus[]> = {
  [WorkflowStatus.DRAFT]: [WorkflowStatus.IN_REVIEW, WorkflowStatus.ARCHIVED],
  [WorkflowStatus.IN_REVIEW]: [WorkflowStatus.DRAFT, WorkflowStatus.APPROVED, WorkflowStatus.ARCHIVED],
  [WorkflowStatus.APPROVED]: [WorkflowStatus.PUBLISHED, WorkflowStatus.DRAFT, WorkflowStatus.ARCHIVED],
  [WorkflowStatus.PUBLISHED]: [WorkflowStatus.DRAFT, WorkflowStatus.ARCHIVED],
  [WorkflowStatus.ARCHIVED]: [WorkflowStatus.DRAFT],
};

const transitionLabels: Record<string, string> = {
  [`${WorkflowStatus.DRAFT}-${WorkflowStatus.IN_REVIEW}`]: 'Submit for Review',
  [`${WorkflowStatus.IN_REVIEW}-${WorkflowStatus.DRAFT}`]: 'Send Back to Draft',
  [`${WorkflowStatus.IN_REVIEW}-${WorkflowStatus.APPROVED}`]: 'Approve',
  [`${WorkflowStatus.APPROVED}-${WorkflowStatus.PUBLISHED}`]: 'Publish',
  [`${WorkflowStatus.APPROVED}-${WorkflowStatus.DRAFT}`]: 'Send Back to Draft',
  [`${WorkflowStatus.PUBLISHED}-${WorkflowStatus.DRAFT}`]: 'Unpublish & Edit',
  'archive': 'Archive',
  [`${WorkflowStatus.ARCHIVED}-${WorkflowStatus.DRAFT}`]: 'Restore to Draft',
};

export function WorkflowStatusComponent({
  currentStatus,
  contentId,
  onStatusChange,
  disabled = false
}: WorkflowStatusProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const config = statusConfig[currentStatus];
  const Icon = config.icon;
  const availableTransitions = validTransitions[currentStatus] || [];

  const handleTransition = async (newStatus: WorkflowStatus) => {
    if (!contentId || disabled || isTransitioning) return;

    setIsTransitioning(true);
    try {
      const response = await fetch(`http://localhost:8030/content/${contentId}/workflow`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update workflow status');
      }

      const updatedContent = await response.json();

      if (onStatusChange) {
        onStatusChange(newStatus);
      }
    } catch (error) {
      console.error('Error updating workflow status:', error);
      alert('Failed to update workflow status. Please try again.');
    } finally {
      setIsTransitioning(false);
    }
  };

  const getTransitionLabel = (from: WorkflowStatus, to: WorkflowStatus): string => {
    if (to === WorkflowStatus.ARCHIVED) {
      return transitionLabels['archive'];
    }
    return transitionLabels[`${from}-${to}`] || `Move to ${statusConfig[to].label}`;
  };

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-lg mb-4">Workflow Status</h3>

      {/* Current Status Display */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2 rounded-full ${config.color} bg-opacity-10`}>
            <Icon className={`h-5 w-5 text-${config.color.replace('bg-', '')}`} />
          </div>
          <div>
            <Badge className={`${config.color} text-white`}>
              {config.label}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground ml-12">
          {config.description}
        </p>
      </div>

      {/* Workflow Timeline */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Workflow Timeline
        </h4>
        <div className="space-y-2">
          {Object.values(WorkflowStatus).map((status, index) => {
            const isActive = status === currentStatus;
            const isPast = Object.values(WorkflowStatus).indexOf(currentStatus) > index;
            const statusCfg = statusConfig[status];
            const StatusIcon = statusCfg.icon;

            return (
              <div
                key={status}
                className={`flex items-center gap-2 text-sm ${
                  isActive
                    ? 'font-semibold text-primary'
                    : isPast
                    ? 'text-muted-foreground'
                    : 'text-gray-400'
                }`}
              >
                <StatusIcon className="h-3 w-3" />
                <span>{statusCfg.label}</span>
                {isActive && <ChevronRight className="h-4 w-4 text-primary" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Transitions */}
      {!disabled && availableTransitions.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Available Actions
          </h4>
          <div className="space-y-2">
            {availableTransitions.map((targetStatus) => {
              const transitionLabel = getTransitionLabel(currentStatus, targetStatus);
              const targetConfig = statusConfig[targetStatus];
              const TargetIcon = targetConfig.icon;

              return (
                <Button
                  key={targetStatus}
                  variant={targetStatus === WorkflowStatus.PUBLISHED ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => handleTransition(targetStatus)}
                  disabled={isTransitioning || !contentId}
                >
                  <TargetIcon className="h-4 w-4 mr-2" />
                  {transitionLabel}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* No Content ID Warning */}
      {!contentId && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            Save the content first to enable workflow transitions.
          </p>
        </div>
      )}
    </Card>
  );
}
