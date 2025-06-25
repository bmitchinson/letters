<script>
	import { closedLetter, openLetter } from '$lib/ascii.js';
	import { enhance } from '$app/forms';

	export let data;
	export let form;

	let isSubmitting = false;
</script>

<h1>{data.mailboxName} mailbox</h1>
<hr class="mt-1 mb-6 w-18 border-gray-600" />

<div class="flex items-center gap-16">
	<!-- Letter submission form -->
	<div class="mb-8 self-start border border-gray-300 p-6">
		{#if form?.missing}
			<div class="mb-4 border border-red-400 bg-red-100 p-3 text-red-700">
				Please fill in all fields.
			</div>
		{/if}

		{#if form?.error}
			<div class="mb-4 border border-red-400 bg-red-100 p-3 text-red-700">
				{form.error}
			</div>
		{/if}

		<form
			method="POST"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					isSubmitting = false;
					await update();
				};
			}}
		>
			<div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<label for="from" class="mb-1 block text-sm font-medium text-gray-700">From:</label>
					<input
						type="text"
						id="from"
						name="from"
						required
						class=" w-full border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						placeholder="Your name"
					/>
				</div>
				<div>
					<label for="to" class="mb-1 block text-sm font-medium text-gray-700">To:</label>
					<input
						type="text"
						id="to"
						name="to"
						required
						class=" w-full border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						placeholder="Recipient's name"
					/>
				</div>
			</div>

			<div class="mb-4">
				<label for="content" class="mb-1 block text-sm font-medium text-gray-700"
					>Letter content:</label
				>
				<textarea
					id="content"
					name="content"
					required
					rows="4"
					class=" w-full border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					placeholder="Write your letter here..."
				></textarea>
			</div>

			<button
				type="submit"
				disabled={isSubmitting}
				class="bg-pink-300 px-6 py-2 hover:bg-pink-200 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{isSubmitting ? 'Sending...' : 'Send Letter'}
			</button>
		</form>
	</div>

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
