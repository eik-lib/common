// @ts-ignore
import scrollIntoView from "scroll-into-view-if-needed";

const main = () => {
	const node = document.getElementById("hero");

	scrollIntoView(node, {
		scrollMode: "if-needed",
		block: "nearest",
		inline: "nearest",
	});
};

main();
