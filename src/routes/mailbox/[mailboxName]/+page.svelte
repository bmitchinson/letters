<script lang="ts">
	import SubmitLetterForm from '$lib/components/SubmitLetterForm.svelte';
	import Letter from '../../../lib/components/Letter.svelte';

	export let data;
</script>

<h1>{data.mailboxName} mailbox</h1>
<hr class="mt-1 mb-8 w-18 border-gray-600" />

<div class="flex flex-wrap items-center gap-16">
	<div class="mb-8 w-xl self-start border border-gray-300 p-6">
		<SubmitLetterForm />
	</div>
	<div class="flex w-2xl flex-grow flex-col items-center gap-4">
		{#each data.mailboxContents as letter}
			<Letter {letter} />
		{/each}
	</div>
</div>
