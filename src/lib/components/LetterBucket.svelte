<script lang="ts">
	import { mailBoxWFlagDown, mailBoxWFlagUp } from '../ascii';

	interface Props {
		displayName: string;
		mailboxName: string;
	}

	let { displayName, mailboxName }: Props = $props();
	let isHovered = $state(false);
	// note: i could do this w css and avoid js but fine for now
</script>

<a
	href="/mailbox/{mailboxName}"
	class="ascii-art block"
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
>
	{@html (isHovered ? mailBoxWFlagUp : mailBoxWFlagDown).replace(
		'{replace}',
		`<span class="${isHovered ? 'text-blue-800 underline' : ''}">${displayName}</span>`
	)}
</a>
