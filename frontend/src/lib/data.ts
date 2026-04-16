import type { Conversation, Message, SharedFile, User } from "@/types";

export const currentUser: User = {
  id: "me",
  name: "You",
  email: "you@example.com",
  avatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA6mrboEBJjcfMAnJMuRBULLP-tPWQYMO98feyZqLNy4jEzWtWyNSNj-YPA4And2X7cd_hdvape9G249lp4UWh09f5p4ocelLQ4Cpdjxhq05jz9brax2neGgiGMIH0VjdoAZ_MR2Hgv_JC_UWBgU7tcF_bps678AicsqCnD9IGsxOckzP4xd6INpQwO9Xb6EZuw8aahrc7XVohVxDyd4OVinufhzlRKW7Os6MFp8P_xUZvgmwo1_EunXkebhaLfvM16KGIIpT5sIoag",
};

export const contacts: User[] = [
  {
    id: "anna",
    name: "Anna Volkov",
    email: "anna@editorial.com",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDarxJ7Ca6LwNJlrXxYft9bYd8dDvf6R1NjYR55p25ePNab-3BVIvGaX4_7D32KQn6L3cnN3TPoNQxFhzT44UBYcu6F-JC3gKG7YnsIFCkD8Y5lbeqSV6OcQR1_GeJqjYDm2OB2vKZ-feCCo0IiJWkj4zhwRp8CApL0ePKbsErj_QQ5yyUm_SmoCrm2aXRqzyzKQpr_Thqm3m75bHucXEZdV9nhudj1Kd84g2IBD2jxBIipE9cKnWrddHxd5xerCLQjY4wJ9AK14FBN",
    status: "online",
    role: "Creative Director @ Editorial",
  },
  {
    id: "james",
    name: "James Miller",
    email: "james@example.com",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDvXMHmYzUK96jRj7B3aZ5h4EhsNzE1hORt3rGwl_MviudWaS-FPA0g4N4b_PuSnpfc8UH7QbthTur09kv9XI_KvqVO0foXzK0QJTOjKWvPkjr9S20EEMAjQvXPKVXVZF0upBSo2Z4TZY2zr6vPlAGXbn-NgOtUIgcyjtcdOtmUYyTMt-6O0JcP5i3UlBI1PpZySILhQKWiEJbVit8rm_P88M1I3_nek__X_Gp6CWel0pUhQBtf0fLiO7sWARL-HCw_qE7_CMOyJsO3",
    status: "offline",
    role: "Developer",
  },
  {
    id: "sarah",
    name: "Sarah Chen",
    email: "sarah@example.com",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCokZooVyltHr-aLWbBx6Mc7bhF6mJAvJ6vnNkndGSFthgCgw1TO8_z69uGk3oe-joylmI1fuWl0mbNKSkQJXyWgt0AhTB-0p-eOz5z0Ewte3L-d_rzy68SsG4NvUCNcpOtBjOf_CFIgD-9LQeGLm1upBjF7jC8Cor5YmMVMUWAKgZaHou-K6tun8nVP6ai3oW2B-0_Sly-1FUzVpvoXUFwF1jsclO6JwexaYqSlvLJzRR8W0O-m9mZdSgR8qKs_Ir3E-tE1gXZGgha",
    status: "online",
    role: "Designer",
  },
];

export const conversations: Conversation[] = [
  {
    id: "conv-anna",
    participant: contacts[0],
    lastMessage: "Wait, did you see the draft?",
    lastMessageTime: "10:46 AM",
    unread: 2,
  },
  {
    id: "conv-james",
    participant: contacts[1],
    lastMessage: "Meeting at 4pm today.",
    lastMessageTime: "9:30 AM",
  },
  {
    id: "conv-sarah",
    participant: contacts[2],
    lastMessage: "The design looks sharp!",
    lastMessageTime: "Yesterday",
  },
];

export const messages: Message[] = [
  {
    id: "msg-1",
    content:
      "The editorial layout for the new campaign just dropped. We need to decide if we're going with the Neobrutalist approach or something more traditional.",
    senderId: "anna",
    timestamp: "10:42 AM",
    type: "text",
  },
  {
    id: "msg-2",
    content:
      "Definitely Neobrutalist. The hard shadows and thick strokes will make it stand out from all the soft SaaS designs out there.",
    senderId: "me",
    timestamp: "10:45 AM",
    type: "text",
  },
  {
    id: "msg-2",
    content:
      "Definitely Neobrutalist. The hard shadows and thick strokes will make it stand out from all the soft SaaS designs out there.",
    senderId: "me",
    timestamp: "10:45 AM",
    type: "text",
  },
  {
    id: "msg-2",
    content:
      "Definitely Neobrutalist. The hard shadows and thick strokes will make it stand out from all the soft SaaS designs out there.",
    senderId: "me",
    timestamp: "10:45 AM",
    type: "text",
  },
  {
    id: "msg-2",
    content:
      "Definitely Neobrutalist. The hard shadows and thick strokes will make it stand out from all the soft SaaS designs out there.",
    senderId: "me",
    timestamp: "10:45 AM",
    type: "text",
  },
  {
    id: "msg-2",
    content:
      "Definitely Neobrutalist. The hard shadows and thick strokes will make it stand out from all the soft SaaS designs out there.",
    senderId: "me",
    timestamp: "10:45 AM",
    type: "text",
  },
  {
    id: "msg-3",
    content: "",
    senderId: "anna",
    timestamp: "10:46 AM",
    type: "image",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAGNoOTtPCCs1aJ0DQ--Zz-M-7TRC_ciGr3K5wjbROj7dpnaXlTE1OFaXgDYteOsLmnEoOdq77Ty_p8aMHTWa6zZaDEaNajNy3E8RfG3ouTbB2Yhh4SvbcktLfRAecoXU7hgnDSESpry-gpSShGXkutZsrrODIXtskL3cOeZr1JjbHUTdRT3irSq74gEVSbxqIzUNGrSpz2hNnX-ZJzTL2x8BMDcGRJejvtZd2Jso0X6AanE7GMLYpBfljFSqdd1tIm7L7CE8kpri3A",
    fileName: "Draft_v1_Final.jpg",
  },
];

export const sharedFiles: SharedFile[] = [
  {
    id: "file-1",
    name: "Project_Brief_2024.pdf",
    size: "2.4 MB",
    date: "FEB 12",
    type: "document",
  },
  {
    id: "file-2",
    name: "Logo_Concept_V2.png",
    size: "5.1 MB",
    date: "FEB 10",
    type: "image",
  },
];

export const mediaAssets: string[] = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBPyjEm2rKZ8GxTCYW4mf4seVeNEiLCW7iCXlH3g2ZARVRdugxW3lhIoI2v8hXSppnvFUAPocJiu0lvrywPUXFzNVT30mDCLOv7YYgi0XAKsjzzU0iqhFfxHKbwQBumNGdjvCVMDubOaq_G_vMYIDh64vy4uA_Dho9asi_nsuUXab9O-G3uB3FGuBzJmK4358wVZ-QxsiEZnc6IKG1d93nzzu1FDA04syNS_q_G7SGKs-Po0XDVJe2LJM5PvtCS_3WxbIRabHks3cbO",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBYlUqkzRDyo8mDxomYYZPCYCALYPjkli6hRQBhGXhw31aYyMBCeO7cScY4jSewg3AM0t8OA1qOwF9bAt9e9fnpHNxf69XbVjAtXYE6HkbJQve-Q6fHF7FMecrGPC2SE4XfN2CnUKf-jesCMJYBYFZTzMVsXCTKT0tY3A2E5ZxhzWnkpiJ-t7h6vT-0ZO6ARQe4lDdy8Bq2Zwn4LpPw2Ay0OjaQlgoi4fAfmQUH79v6L_ceaJFo1rbqPYJzYwI_LqdE03MLWoRh_IOY",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCAUCS_-GaQX8gKuX7Pq92QFsWQf_FDPHIpiZscioCTQUA9X8a_8nLWzSyFTjRadWQqVdGkWpWjX-iqTeIYmzUp6FymN0_kixv0b3ZUN2Wi0Quk_3T-mJz3AuccWNtbZf6t39Nk1TvAgnh2YGQQRanYI8Ou65QWTGWG8hVGM8sq77X1nr7hzNzJlKRdzJSPtZfwXl5zs-sR-OY2nT7AGDuRNN-X61VuS_Ci_TiXMdRKUzqDIVx4y6m4oOn9KCaHgvqZMQXxTLW8YGZq",
];

export const avatarUrl: string =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCxXONw2_tjpuK327eKsgDQmA5N2_J8ul-ToKV5P-G1sAgzetDAmFdio7S2IhEHzVOEb4cFsGGu3qG3DLOn6jmuKWeDp21eJW1ZaXv5xu0AMDQEzWPU8bnxryGjDnI4szxWxm1FxuNaQ32UXBwjx_jbuSRUHqXDAAeRhqdfw7CkZeEN2A-dwVNVk07dQBOEuYUKaDhQV7mEJ6IqIicF3pKuRl9yJISkLgDLqNYiX_WeVsFvEPmnddHSpjTUG5BGk1r0r1f2tjvuJX58";
