export const Editor = () => {
	return (
		<div className="h-full bg-gray-900 dark:bg-zinc-950 text-gray-300 dark:text-gray-400 p-4 font-mono">
			<pre className="text-gray-300 font-mono text-sm">
				{`// Welcome to the editor
function greeting() {
    console.log("Hello, World!");
}

// Start coding here...`}
			</pre>
		</div>
	);
};
