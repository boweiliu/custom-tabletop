<script lang="ts">
	import { useQuery } from 'convex-svelte';
	import { api } from './convex/_generated/api.js';
  import { getContext, setContext, untrack } from 'svelte';

  const sampleContext = getContext('key');
//   console.log({sampleContext});

	const query2 = {} as any; // useQuery(api.tasks.get, {});
	const query = useQuery(api.tasks.get, {});
	console.log({useQuery})
//   console.log({query2});
</script>

<div id="query-result">
  Bowei
{#if query.isLoading}
	Loading...
{:else if query.error}
	failed to load: {query.error.toString()}
{:else}
	<ul>
		{#each query.data as task}
			<li>
				{task.isCompleted ? '☑' : '☐'}
				<span>{task.text}</span>
				<span>assigned by {task.assigner}</span>
			</li>
		{/each}
	</ul>
{/if}
</div>