import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Единый центр знаний',
    Svg: require('@site/static/img/school.svg').default,
    description: (
      <>
        Всё что нужно, собранно в одном месте
      </>
    ),
  },
  {
    title: 'Эффективность',
    Svg: require('@site/static/img/monitoring.svg').default,
    description: (
      <>
        Чёткие регламенты ускоряют работу, коммуникацию и онбординг
      </>
    ),
  },
  {
    title: 'Прозрачность процессов',
    Svg: require('@site/static/img/badge.svg').default,
    description: (
      <>
        понятные правила, ясные ожидания, предсказуемый результат
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
