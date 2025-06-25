<script>
	import { closedLetter, openLetter } from '$lib/ascii.js';
	import SubmitLetterForm from '$lib/components/SubmitLetterForm.svelte';

	export let data;
</script>

<h1>{data.mailboxName} mailbox</h1>
<hr class="mt-1 mb-6 w-18 border-gray-600" />

<div class="flex items-center gap-16">
	<SubmitLetterForm />

	<div class="flex flex-grow flex-col items-center gap-8">
		{#each data.mailboxContents as letter}
			<div class="flex w-full items-center gap-8">
				<div class="ascii-art">
					<p>{closedLetter}</p>
				</div>

				<div class="letter w">
					<p><strong>to:</strong> {letter.to}</p>
					<p><strong>from:</strong> {letter.from}</p>
					<p class="my-4">
						<em
							>{new Date(letter.created_at).toLocaleDateString('en-US', {
								weekday: 'long',
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})} at {new Date(letter.created_at).toLocaleTimeString('en-US', {
								hour: 'numeric',
								minute: '2-digit',
								hour12: true
							})}</em
						>
					</p>
					<p>{letter.content}</p>
				</div>
			</div>
		{/each}
	</div>
</div>
