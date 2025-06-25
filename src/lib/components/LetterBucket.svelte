<script lang="ts">
	import { mailBoxWFlagDown, mailBoxWFlagUp } from '../ascii';

	interface Props {
		displayName: string;
		mailboxName: string;
	}

	let { displayName, mailboxName }: Props = $props();
	let isHovered = $state(false);
</script>

<a
	href="/mailbox/{mailboxName}"
	class="ascii-art block"
	on:mouseenter={() => (isHovered = true)}
	on:mouseleave={() => (isHovered = false)}
>
	{@html (isHovered ? mailBoxWFlagUp : mailBoxWFlagDown).replace(
		'{replace}',
		`<span class="${isHovered ? 'text-blue-800 underline' : ''}">${displayName}</span>`
	)}
</a>
