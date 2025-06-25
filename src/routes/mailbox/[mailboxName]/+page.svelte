<script lang="ts">
	import SubmitLetterForm from '$lib/components/SubmitLetterForm.svelte';
	import Letter from '$lib/components/Letter.svelte';
	import PasswordPrompt from '$lib/components/PasswordPrompt.svelte';
	import { blueLink, hrStyles } from '../../../lib/commonTailwind.js';

	export let data;
	export let form;

	$: authError = form?.error || null;
</script>

{#if data.authMissing}
	<PasswordPrompt mailboxName={data.mailboxName} error={authError} />
{:else}
	<div class="mb-2 flex flex-col items-center">
		<h1>{data.mailboxName} mailbox</h1>
		<form method="POST" action="?/logout" class="inline">
			<button type="submit" class={blueLink}>
				<h1>logout</h1>
			</button>
		</form>
	</div>
	<hr class={'mt-1 mb-12 ' + hrStyles} />

	<div class="flex flex-wrap items-center gap-x-16">
		<div class="mb-8 min-w-sm self-start border border-gray-300 p-6">
			<SubmitLetterForm {form} />
		</div>
		<div class="flex flex-grow flex-col items-center gap-4">
			{#each data.mailboxContents as letter}
				<Letter {letter} />
			{/each}
		</div>
	</div>
{/if}
