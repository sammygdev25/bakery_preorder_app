import { Section, Split, Card, CardBody } from '../components/ui';
import { Icon } from '../components/icons';
import type { IconName } from '../components/icons';

interface ValuePoint {
  icon: IconName;
  title: string;
  text: string;
}

interface HomeAboutProps {
  title?: string;
  story?: string[];
  values?: ValuePoint[];
}

const defaultStory = [
  "Our bakery started with a simple idea: everyone deserves a cake made just for them, not pulled from a cold case. Every cake and pastry we sell is baked to order, from scratch, in small batches.",
  "Pre-order your celebration cake, your weekend pastry box, or a batch of cookies for the office, pick a pickup time that works for you, and pay securely online. We'll have it ready, warm from the oven, waiting for you.",
];

const defaultValues: ValuePoint[] = [
  {
    icon: 'heart',
    title: 'Made with care',
    text: 'Small batches, real butter, real fruit. Nothing rushed, nothing frozen.',
  },
  {
    icon: 'clock',
    title: 'Ready when you are',
    text: 'Schedule your pickup time at checkout and skip the wait at the counter.',
  },
  {
    icon: 'award',
    title: 'Baked to order',
    text: 'Every cake is started after you order it, never pulled from a shelf.',
  },
];

export default function HomeAbout({
  title = 'Our story',
  story = defaultStory,
  values = defaultValues,
}: HomeAboutProps) {
  return (
    <Section eyebrow="About us" title={title}>
      <Split>
        <div className="ds-stack">
          {story.map((paragraph, idx) => (
            <p key={idx} className="ds-lead">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="ds-stack">
          {values.map((value) => (
            <Card key={value.title}>
              <CardBody>
                <div className="ds-cluster">
                  <Icon name={value.icon} size={24} title={value.title} />
                  <h3 className="ds-card-title">{value.title}</h3>
                </div>
                <p className="ds-muted">{value.text}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </Split>
    </Section>
  );
}