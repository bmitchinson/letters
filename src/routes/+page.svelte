<script>
	import LetterBucket from '$lib/components/LetterBucket.svelte';
</script>

<h1>mailboxes</h1>
<hr class="mt-1 w-18 border-gray-600" />

<div class="mt-4 flex flex-wrap gap-16">
	<LetterBucket displayName="maeve's mailbox" mailboxName="maeve" />

	<LetterBucket displayName="public mailbox" mailboxName="public" />
</div>
