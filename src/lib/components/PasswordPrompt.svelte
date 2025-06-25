<script lang="ts">
	import { enhance } from '$app/forms';
	import { blueLink, hrStyles } from '../commonTailwind';

	export let mailboxName: string;
	export let error: string | null = null;
</script>

<h1 class="mb-2 text-center text-2xl font-bold text-gray-900">
	access mailbox - {mailboxName}
</h1>
<hr class={'mb-16 ' + hrStyles} />

<form class="flex flex-col justify-center" method="POST" action="?/authenticate" use:enhance>
	<div class="mb-4">
		<input
			id="password"
			name="password"
			required
			autocomplete="off"
			data-form-type="other"
			class="w-full border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
			placeholder="password"
		/>
	</div>

	<button type="submit" class={blueLink}> open mailbox </button>

	{#if error}
		<div class="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
			{error}
		</div>
	{/if}
</form>
