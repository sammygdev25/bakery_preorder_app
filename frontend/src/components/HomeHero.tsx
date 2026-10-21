import { Hero, Button, Media } from '../components/ui';
import { Icon } from '../components/icons';

interface HomeHeroProps {
  imageUrl?: string;
}

export default function HomeHero({ imageUrl }: HomeHeroProps) {
  return (
    <Hero
      eyebrow="Freshly Baked, Pre-Ordered"
      title="Cakes and pastries made to order, ready when you are"
      text="Browse our menu of handcrafted cakes and pastries, build your order, and pick a pickup time that works for you. Pay online and skip the line when you arrive."
      actions={
        <>
          <Button variant="primary" size="lg" to="/menu">
            Browse the Menu
          </Button>
          <Button variant="ghost" size="lg" to="/menu?category=cakes">
            <Icon name="star" size={18} /> See Featured Bakes
          </Button>
        </>
      }
      media={imageUrl ? <Media src={imageUrl} alt="A display of freshly baked cakes and pastries" ratio="wide" /> : undefined}
    />
  );
}