<script>
	import { enhance } from '$app/forms';

	let form;
	let isSubmitting = false;
</script>

<!-- Letter submission form -->

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
				placeholder="from"
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
				placeholder="to"
			/>
		</div>
	</div>

	<div class="mb-4">
		<label for="content" class="mb-1 block text-sm font-medium text-gray-700">Letter content:</label
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
