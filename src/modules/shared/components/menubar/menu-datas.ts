import {
  BriefcaseMedical,
  Building,
  CalendarClock,
  CalendarPlus,
  CalendarRange,
  FileSliders,
  LayoutDashboard,
  Palette,
  Settings,
  Settings2,
  ShieldUser,
  Stethoscope,
  UserCog,
  UserRoundCog,
  Wrench,
} from "lucide-react";

export const homeSidebarData = {
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/bezs",
          icon: "layout-dashboard",
        },
        {
          title: "Calendar",
          url: "/bezs/calendar",
          icon: "calendar-range",
        },
      ],
    },
    {
      title: "Others",
      items: [
        {
          title: "Settings",
          icon: "settings",
          items: [
            {
              title: "Profile",
              url: "/bezs/settings",
              icon: "user-cog",
            },
            {
              title: "Account",
              url: "/bezs/settings/account",
              icon: "wrench",
            },
            {
              title: "Preference",
              url: "/bezs/settings/preference",
              icon: "palette",
            },
          ],
        },
      ],
    },
  ],
};

export const adminSidebarData = {
  navGroups: [
    {
      title: "Admin Management",
      items: [
        {
          title: "Manage Apps",
          url: "/bezs/admin/manage-apps",
          icon: LayoutDashboard,
        },
        {
          title: "Manage Organizations",
          url: "/bezs/admin/manage-organizations",
          icon: Building,
        },
        {
          title: "Manage Roles",
          url: "/bezs/admin/manage-roles",
          icon: UserRoundCog,
        },
        {
          title: "RBAC",
          url: "/bezs/admin/rbac",
          icon: ShieldUser,
        },
        {
          title: "Preference Templates",
          url: "/bezs/admin/manage-preferences",
          icon: FileSliders,
        },
      ],
    },
  ],
};

export const telemedicineSidebarData = {
  navGroups: [
    {
      title: "Admin Management",
      items: [
        {
          title: "Manage Doctors",
          url: "/bezs/telemedicine/admin/manage-doctors",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "Doctor",
      items: [
        {
          title: "Dashboard",
          url: "/bezs/telemedicine/doctor",
          icon: LayoutDashboard,
        },
        {
          title: "Professional Settings",
          icon: Stethoscope,
          items: [
            {
              title: "Services",
              url: "/bezs/telemedicine/doctor/settings/services",
              icon: BriefcaseMedical,
            },
            {
              title: "Availability",
              url: "/bezs/telemedicine/doctor/settings/availability",
              icon: CalendarClock,
            },
          ],
        },
        {
          title: "Settings",
          icon: Settings2,
          items: [
            {
              title: "Profile",
              url: "/bezs/telemedicine/doctor/settings/profile",
              icon: UserCog,
            },
          ],
        },
      ],
    },
    {
      title: "Patient",
      items: [
        {
          title: "Dashboard",
          url: "/bezs/telemedicine/patient",
          icon: LayoutDashboard,
        },
        {
          title: "Profile",
          url: "/bezs/telemedicine/patient/profile",
          icon: UserCog,
        },
        {
          title: "Book Appointment",
          url: "/bezs/telemedicine/patient/appointments/book",
          icon: CalendarPlus,
        },
        {
          title: "Appointment Intake",
          url: "/bezs/telemedicine/patient/askai",
          icon: CalendarPlus,
        },
      ],
    },
    // {
    //   title: "Others",
    //   items: [
    //     {
    //       title: "Settings",
    //       icon: Settings,
    //       items: [
    //         {
    //           title: "Profile",
    //           url: "/bezs/telemedicine/doctor/profile",
    //           icon: UserCog,
    //         },
    //         {
    //           title: "Availability",
    //           url: "/bezs/telemedicine/doctor/availability",
    //           icon: CalendarClock,
    //         },
    //       ],
    //     },
    //   ],
    // },
  ],
};
