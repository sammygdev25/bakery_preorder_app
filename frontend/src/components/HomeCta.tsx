import { Section, Button } from '../components/ui';
import { Icon } from '../components/icons';
import { useAuth } from '../contexts/AuthContext';

interface HomeCtaProps {
  title?: string;
  text?: string;
}

export default function HomeCta({
  title = 'Ready to make something sweet happen?',
  text = 'Browse our cakes and pastries, pick a pickup time, and we will have it fresh and waiting for you.',
}: HomeCtaProps) {
  const { isAuthenticated } = useAuth();

  return (
    <Section tight>
      <div className="ds-hero" style={{ textAlign: 'center' }}>
        <h2 className="ds-card-title">{title}</h2>
        <p className="ds-lead">{text}</p>
        <div className="ds-cluster" style={{ justifyContent: 'center' }}>
          <Button to="/menu" variant="primary" size="lg">
            <Icon name="book" size={18} />
            Browse the menu
          </Button>
          {!isAuthenticated && (
            <Button to="/register" variant="ghost" size="lg">
              <Icon name="user" size={18} />
              Create an account
            </Button>
          )}
        </div>
      </div>
    </Section>
  );
}