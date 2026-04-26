import { Semester } from "./types";

export const SEMESTERS: Semester[] = [
  {
    id: "3-2",
    label: "Semester 3-2",
    academicYear: "2025-26",
    subjects: [
      {
        id: "mup",
        label: "Microprocessors",
        code: "CS F342",
        color: "#7c6af7",
        page: null,
      },
      {
        id: "sas",
        label: "Signals and Systems",
        code: "EEE F341",
        color: "#4ecca3",
        page: null,
      },
      {
        id: "consys",
        label: "Control Systems",
        code: "EEE F342",
        color: "#f97c6b",
        page: null,
      },
      {
        id: "amp",
        label: "Atomic and Molecular Physics",
        code: "PHY F241",
        color: "#60a5fa",
        page: null,
      },
      {
        id: "npp",
        label: "Nuclear and Particle Physics",
        code: "PHY F343",
        color: "#a78bfa",
        page: "/subjects/nuclear-physics.html",
      },
      {
        id: "ssp",
        label: "Solid State Physics",
        code: "PHY F244",
        color: "#86efac",
        page: null,
      },
      {
        id: "mue",
        label: "Microelectronic Engineering",
        code: "EEE F244",
        color: "#fb923c",
        page: null,
      },
      {
        id: "edsl",
        label: "EDSL Lab",
        code: "EEE F215",
        color: "#f472b6",
        page: null,
      },
    ],
  },
];
