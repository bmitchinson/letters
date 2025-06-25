<script>
	import { hrStyles } from '$lib/commonTailwind';
	import LetterBucket from '$lib/components/LetterBucket.svelte';
</script>

<h1>mailboxes</h1>
<hr class={'mt-1 ' + hrStyles} />

<div class="mt-4 flex flex-wrap gap-16">
	<LetterBucket displayName="maeve's mailbox" mailboxName="maeve" />

	<LetterBucket displayName="public mailbox" mailboxName="public" />
</div>
