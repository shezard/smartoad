export type Graph = {
	nodes: {
		component: any;
		props: {
			exec: Exec;
		};
	}[];
	links: Link[];
};

export type Link = [number, number];

export type Exec = (value: string, index: number) => void | Promise<void>;
