export type Graph = {
	nodes: {
		component: any;
		props: any;
	}[];
	links: Link[];
};

export type Link = [number, number];
