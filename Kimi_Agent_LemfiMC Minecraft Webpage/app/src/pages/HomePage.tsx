import HeroHeader from '../sections/HeroHeader'
import CommunityNews from '../sections/CommunityNews'
import LatestVideos from '../sections/LatestVideos'
import StickyFooter from '../sections/StickyFooter'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#151217]" style={{ paddingBottom: '100px' }}>
      <HeroHeader />
      <CommunityNews />
      <LatestVideos />
      <StickyFooter />
    </div>
  )
}
