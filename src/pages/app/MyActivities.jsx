import { useEffect, useState } from 'react';
import SidebarLayout from '../../components/layout/SideBarLayout';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, doc, documentId } from 'firebase/firestore';
import { Loader2, Heart, Bookmark, Edit } from 'lucide-react';

const PublicationItem = ({ pub }) => (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                {(pub.userName || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
                <p className="text-white font-semibold">{pub.userName}</p>
                <p className="text-xs text-gray-400">{new Date(pub.timestamp).toLocaleDateString()}</p>
            </div>
        </div>
        <p className="text-gray-300 text-sm">{pub.content}</p>
    </div>
);

function MyActivities() {
    const { user, profile, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState('my-posts');
    const [myPosts, setMyPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const [savedPosts, setSavedPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user || !profile) return;
            setLoading(true);

            try {
                const myPostsQuery = query(collection(db, 'publications'), where('userId', '==', user.uid));
                const myPostsSnap = await getDocs(myPostsQuery);
                setMyPosts(myPostsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

                if (profile.likedPublications && profile.likedPublications.length > 0) {
                    const likedQuery = query(collection(db, 'publications'), where(documentId(), 'in', profile.likedPublications));
                    const likedSnap = await getDocs(likedQuery);
                    setLikedPosts(likedSnap.docs.map(d => ({ id: d.id, ...d.data() })));
                }

                if (profile.savedPublications && profile.savedPublications.length > 0) {
                    const savedQuery = query(collection(db, 'publications'), where(documentId(), 'in', profile.savedPublications));
                    const savedSnap = await getDocs(savedQuery);
                    setSavedPosts(savedSnap.docs.map(d => ({ id: d.id, ...d.data() })));
                }

            } catch (error) {
                console.error("Error fetching user activities:", error);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchData();
        }
    }, [user, profile, authLoading]);

    const renderContent = () => {
        if (loading || authLoading) {
            return <div className="flex justify-center items-center p-10"><Loader2 className="w-8 h-8 animate-spin" /></div>;
        }

        let data, emptyMessage;
        switch (activeTab) {
            case 'liked-posts':
                data = likedPosts;
                emptyMessage = "Você ainda não curtiu nenhuma publicação.";
                break;
            case 'saved-posts':
                data = savedPosts;
                emptyMessage = "Você ainda não salvou nenhuma publicação.";
                break;
            default:
                data = myPosts;
                emptyMessage = "Você ainda não fez nenhuma publicação.";
        }

        if (data.length === 0) {
            return <p className="text-gray-500 text-center p-10">{emptyMessage}</p>;
        }

        return <div className="space-y-4">{data.map(pub => <PublicationItem key={pub.id} pub={pub} />)}</div>;
    };

    return (
        <SidebarLayout>
            <div className="p-6 max-w-4xl mx-auto text-white">
                <h2 className="text-3xl font-bold mb-6">Minhas Atividades</h2>

                <div className="border-b border-gray-700 mb-6">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        <button onClick={() => setActiveTab('my-posts')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'my-posts' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>
                            <Edit size={16} /> Minhas Publicações
                        </button>
                        <button onClick={() => setActiveTab('liked-posts')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'liked-posts' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>
                            <Heart size={16} /> Curtidas
                        </button>
                        <button onClick={() => setActiveTab('saved-posts')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'saved-posts' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>
                            <Bookmark size={16} /> Salvas
                        </button>
                    </nav>
                </div>

                <div>
                    {renderContent()}
                </div>
            </div>
        </SidebarLayout>
    );
}

export default MyActivities;
