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

export type Exec = (value: string, setOutput?: SetOutput) => void | Promise<void>;

export type SetOutput = (index: number, value: string) => void;
