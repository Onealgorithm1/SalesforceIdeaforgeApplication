import { LightningElement, api } from 'lwc';

export default class IdeaTimeAgo extends LightningElement {
    @api title;
    @api createdDate;

    get timeAgo() {
        if (!this.createdDate) return '';

        const now = new Date().getTime();
        const created = new Date(this.createdDate).getTime();
        const diff = now - created;

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (seconds < 60) return "just now";
        if (minutes < 60) return `${minutes} min ago`;
        if (hours < 24) return `${hours} hr ago`;
        if (days === 1) return "yesterday";
        if (days < 30) return `${days} days ago`;
        if (days < 365) return `${Math.floor(days / 30)} months ago`;
        return `${Math.floor(days / 365)} years ago`;
    }
}