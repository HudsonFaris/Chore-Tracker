export interface Chore {
  id: string;
  title: string;
  category: string;
  description: string;
  steps: string[];
  assignedTo: string;
  status: "Not Started" | "In Progress" | "Completed" | "Overdue";
  dueDate: string;
  dueTime: string;
  choreDay: string;
  uploadProof: boolean;
  proofDeadline: string;
  extensionRequested: boolean;
}

export const chores: Chore[] = [
  {
    id: "1",
    title: "Dishes 1",
    category: "Kitchen",
    description: "Wash dishes for 30 minutes",
    steps: [
      "Wash all dishes in the sink",
      "Empty out the drain traps",
      "Put clean dishes in the drying rack",
    ],
    assignedTo: "Alex",
    status: "Not Started",
    dueDate: "02/17/26",
    dueTime: "5PM",
    choreDay: "Chore Day 1",
    uploadProof: true,
    proofDeadline: "02/17 at 5PM",
    extensionRequested: false,
  },
  {
    id: "2",
    title: "Vacuuming",
    category: "Common Areas",
    description: "Vacuum all common area floors",
    steps: [
      "Vacuum the living room",
      "Vacuum the hallways",
      "Empty the vacuum bag when done",
    ],
    assignedTo: "Jordan",
    status: "In Progress",
    dueDate: "02/17/26",
    dueTime: "3PM",
    choreDay: "Chore Day 1",
    uploadProof: true,
    proofDeadline: "02/17 at 3PM",
    extensionRequested: false,
  },
  {
    id: "3",
    title: "Bathroom Clean",
    category: "Bathroom",
    description: "Deep clean the shared bathroom",
    steps: [
      "Scrub the toilets and sinks",
      "Mop the bathroom floor",
      "Restock paper towels and soap",
    ],
    assignedTo: "Sam",
    status: "Completed",
    dueDate: "02/16/26",
    dueTime: "6PM",
    choreDay: "Chore Day 1",
    uploadProof: true,
    proofDeadline: "02/16 at 6PM",
    extensionRequested: false,
  },
  {
    id: "4",
    title: "Trash Duty",
    category: "General",
    description: "Take out all trash and recycling",
    steps: [
      "Collect trash from all rooms",
      "Take bags to the dumpster",
      "Replace trash bags in all bins",
    ],
    assignedTo: "Alex",
    status: "Overdue",
    dueDate: "02/15/26",
    dueTime: "8PM",
    choreDay: "Chore Day 1",
    uploadProof: false,
    proofDeadline: "02/15 at 8PM",
    extensionRequested: true,
  },
];
