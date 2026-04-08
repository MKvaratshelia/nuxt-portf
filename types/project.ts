export type Project = {
    id: number;
    title: string;
    image: string;
    description: string;
    githubUrl: string;
    url: string | null;
    createdAt: string;
    updatedAt: string;
};

export type ProjectPayload = {
    title: string;
    image: string;
    description: string;
    githubUrl: string;
    url?: string | null;
};
