import { Section, Grid, Card, CardBody, CardTitle, CardMeta } from '../components/ui';
import { Icon } from '../components/icons';
import type { Category } from '../types';

interface HomeCategoriesProps {
  categories: Category[];
}

const CATEGORY_ICONS: Record<string, 'sparkle' | 'star' | 'heart' | 'award'> = {
  cakes: 'sparkle',
  pastries: 'star',
  cookies: 'heart',
  cupcakes: 'award',
};

function iconFor(slug: string) {
  return CATEGORY_ICONS[slug] || 'sparkle';
}

export default function HomeCategories({ categories }: HomeCategoriesProps) {
  if (!categories || categories.length === 0) {
    return (
      <Section
        eyebrow="How it works"
        title="From oven to pickup in three easy steps"
        subtitle="Pre-order your favorite cakes and pastries and skip the wait"
      >
        <Grid size="sm" cols={3}>
          <Card>
            <CardBody>
              <Icon name="book" size={28} />
              <CardTitle>Browse the menu</CardTitle>
              <CardMeta>Pick from our fresh cakes, pastries and daily bakes.</CardMeta>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Icon name="calendar" size={28} />
              <CardTitle>Choose a pickup date</CardTitle>
              <CardMeta>Schedule your order for exactly when you need it.</CardMeta>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Icon name="credit-card" size={28} />
              <CardTitle>Pay online</CardTitle>
              <CardMeta>Secure checkout, then swing by and pick up your treats.</CardMeta>
            </CardBody>
          </Card>
        </Grid>
      </Section>
    );
  }

  return (
    <Section
      eyebrow="Browse by category"
      title="What are you craving?"
      subtitle="From celebration cakes to flaky morning pastries, find it all by category"
    >
      <Grid size="sm" cols={3}>
        {categories.map((category) => (
          <Card key={category.id} to={`/menu?category=${category.slug}`}>
            <CardBody>
              <Icon name={iconFor(category.slug)} size={28} />
              <CardTitle>{category.name}</CardTitle>
              <CardMeta>Shop {category.name.toLowerCase()}</CardMeta>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}