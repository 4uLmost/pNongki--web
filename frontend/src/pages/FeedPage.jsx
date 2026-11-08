import React, { useState, useRef, useMemo, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/useAuth';
import { BADGES } from '../components/feed/feedData';
import FeedLeftSidebar from '../components/feed/FeedLeftSidebar';
import FeedRightSidebar from '../components/feed/FeedRightSidebar';
import FeedPostCard from '../components/feed/FeedPostCard';
import FeedDetailView from '../components/feed/FeedDetailView';
import ReplyModal from '../components/feed/ReplyModal';
import CreateThreadModal from '../components/feed/CreateThreadModal';
import WebAcquisitionModal from '../components/feed/WebAcquisitionModal';

export default function FeedPage({
  places = [],
  onNavigate,
  onSelectPlace,
  currentUser: propCurrentUser,
}) {
  const auth = useAuth() || {};
  const currentUser = propCurrentUser || auth.user || null;

  const currentUserId = currentUser?.id || null;
  const currentUserName = currentUser?.name || currentUser?.full_name || (currentUser?.isDemo ? 'Anak Ulama' : 'Kamu');
  const currentUserCampus = currentUser?.campus || (currentUser?.isDemo ? 'Informatika • ITB (Kamu)' : 'Mahasiswa pNongki!');
  const currentUserRole =
    currentUser?.role === 'owner' ? 'Owner Kafe' : currentUser?.role === 'admin' ? 'Admin' : 'Mahasiswa';
  const currentUserInitials = (currentUserName || 'AU')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedError, setFeedError] = useState(null);
  const [selectedFeedType, setSelectedFeedType] = useState('all');
  const [selectedFeedTab, setSelectedFeedTab] = useState('all');
  const [feedSearchQuery, setFeedSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const allPlaces = useMemo(() => {
    return Array.isArray(places) ? places : [];
  }, [places]);

  const popularPlacesList = useMemo(() => {
    return [...allPlaces]
      .sort((a, b) => {
        const ratingDiff = (Number(b.rating) || 0) - (Number(a.rating) || 0);
        if (ratingDiff !== 0) return ratingDiff;
        return (Number(b.reviewCount || b.review_count) || 0) - (Number(a.reviewCount || a.review_count) || 0);
      })
      .slice(0, 3);
  }, [allPlaces]);

  const partnerPlacesList = useMemo(() => {
    const partners = allPlaces.filter((p) => Boolean(p.is_partner || p.isPartner));
    return (partners.length > 0 ? partners : allPlaces).slice(0, 3);
  }, [allPlaces]);

  const rightCardsRef = useRef(null);

  useEffect(() => {
    let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;

    const handleScroll = () => {
      const cards = rightCardsRef.current;
      if (!cards) return;

      if (window.innerWidth < 1024) {
        cards.style.position = '';
        cards.style.top = '';
        return;
      }

      const viewportHeight = window.innerHeight;
      const cardsHeight = cards.offsetHeight;
      const topOffset = 138;
      const bottomMargin = 24;

      if (cardsHeight + topOffset + bottomMargin <= viewportHeight) {
        cards.style.position = 'sticky';
        cards.style.top = `${topOffset}px`;
        return;
      }

      const scrollY = window.scrollY;
      const deltaY = scrollY - lastScrollY;
      lastScrollY = scrollY;

      if (scrollY <= 80) {
        cards.style.position = 'sticky';
        cards.style.top = `${topOffset}px`;
        return;
      }

      const maxTop = topOffset;
      const minTop = viewportHeight - cardsHeight - bottomMargin;

      const computedStyle = window.getComputedStyle(cards);
      const currentTopVal = parseFloat(computedStyle.top) || topOffset;

      let newTop;
      if (deltaY > 0) {
        newTop = Math.max(minTop, Math.min(maxTop, currentTopVal - deltaY));
      } else {
        newTop = Math.min(maxTop, Math.max(minTop, currentTopVal - deltaY));
      }

      cards.style.position = 'sticky';
      cards.style.top = `${newTop}px`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [popularPlacesList, partnerPlacesList, posts]);

  const [selectedPostId, setSelectedPostId] = useState(null);
  const lastScrollPosition = useRef(0);
  const lastClickedPostId = useRef(null);

  const [showThreadModal, setShowThreadModal] = useState(false);
  const [newThreadContent, setNewThreadContent] = useState('');
  const [newThreadPlaceId, setNewThreadPlaceId] = useState('');
  const [placeSearchQuery, setPlaceSearchQuery] = useState('');
  const [isPlaceSearchOpen, setIsPlaceSearchOpen] = useState(false);
  const [newThreadCategory, setNewThreadCategory] = useState('');
  const [uploadedImagePreview, setUploadedImagePreview] = useState('');
  const [isThreadDragOver, setIsThreadDragOver] = useState(false);
  const threadFileInputRef = useRef(null);

  const [replyModalPost, setReplyModalPost] = useState(null);
  const [replyTargetComment, setReplyTargetComment] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyPlaceId, setReplyPlaceId] = useState('');
  const [replyPlaceSearchQuery, setReplyPlaceSearchQuery] = useState('');
  const [isReplyPlaceSearchOpen, setIsReplyPlaceSearchOpen] = useState(false);
  const [replyImagePreview, setReplyImagePreview] = useState('');
  const [isReplyDragOver, setIsReplyDragOver] = useState(false);
  const replyFileInputRef = useRef(null);

  const [inlineReplyTarget, setInlineReplyTarget] = useState(null);
  const [inlineReplyText, setInlineReplyText] = useState('');

  const [showAppAcquisitionModal, setShowAppAcquisitionModal] = useState(false);
  const [acquisitionReason, setAcquisitionReason] = useState('invite');

  const loadPosts = async () => {
    setIsLoading(true);
    setFeedError(null);
    try {
      const remotePosts = await api.getPosts(currentUserId);
      if (Array.isArray(remotePosts)) {
        setPosts(remotePosts);
      } else {
        setPosts([]);
      }
    } catch (err) {
      console.warn('Gagal memuat feeds:', err);
      setPosts([]);
      setFeedError(
        'Gagal memuat linimasa Feeds dari server database. Pastikan jaringan internet aktif.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [currentUserId]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2800);
  };

  const processImageFile = (file, onSuccess) => {
    if (!file.type.startsWith('image/')) {
      alert('Harap unggah file format gambar (JPG, PNG, WebP)!');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file melebihi batas maksimal 5 MB!');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onSuccess(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const isPostMine = (post) => {
    if (!post) return false;
    if (currentUserId) {
      if (
        post.userId === currentUserId ||
        post.author?.id === currentUserId ||
        post.author?.userId === currentUserId
      ) {
        return true;
      }
    }
    if (post.author?.isMe) return true;
    if (
      currentUserName &&
      post.author?.name &&
      post.author.name.toLowerCase().trim() === currentUserName.toLowerCase().trim()
    ) {
      return true;
    }
    if (currentUser?.isDemo && (post.author?.name === 'Anak Ulama' || post.author?.isMe)) {
      return true;
    }
    return false;
  };

  const myThreadsCount = useMemo(() => {
    return posts.filter((p) => {
      const isMine = isPostMine(p);
      const isThread = p.postType === 'thread' || (!p.isHangout && p.postType !== 'hangout');
      return isMine && isThread;
    }).length;
  }, [posts, currentUserId, currentUserName]);

  const likedPostsCount = useMemo(() => {
    return posts.filter((p) => Boolean(p.isLiked)).length;
  }, [posts]);

  const hasMyReply = (post) => {
    if (!post || !Array.isArray(post.comments)) return false;
    return post.comments.some((c) => {
      const isDirectMatch =
        (currentUserId && c.userId === currentUserId) ||
        (currentUserName && c.author && c.author.toLowerCase().includes(currentUserName.toLowerCase())) ||
        (currentUser?.isDemo && (c.author?.includes('Kamu') || c.author?.includes('Anak Ulama')));
      if (isDirectMatch) return true;
      if (Array.isArray(c.replies)) {
        return c.replies.some((r) =>
          (currentUserId && r.userId === currentUserId) ||
          (currentUserName && r.author && r.author.toLowerCase().includes(currentUserName.toLowerCase())) ||
          (currentUser?.isDemo && (r.author?.includes('Kamu') || r.author?.includes('Anak Ulama')))
        );
      }
      return false;
    });
  };

  const myRepliesCount = useMemo(() => {
    return posts.filter(hasMyReply).length;
  }, [posts, currentUserId, currentUserName, currentUser]);

  const filteredPosts = posts.filter((post) => {
    if (feedSearchQuery.trim()) {
      const q = feedSearchQuery.toLowerCase().trim();
      const contentMatch = post.content && post.content.toLowerCase().includes(q);
      const titleMatch = post.title && post.title.toLowerCase().includes(q);
      const authorMatch = post.author?.name && post.author.name.toLowerCase().includes(q);
      const placeMatch = post.taggedPlace?.name && post.taggedPlace.name.toLowerCase().includes(q);
      if (!contentMatch && !titleMatch && !authorMatch && !placeMatch) {
        return false;
      }
    }

    if (selectedFeedTab === 'my_threads') {
      const isMine = isPostMine(post);
      const isThread = post.postType === 'thread' || (!post.isHangout && post.postType !== 'hangout');
      if (!isMine || !isThread) return false;
    }
    if (selectedFeedTab === 'liked' && !post.isLiked) return false;
    if (selectedFeedTab === 'my_replies' && !hasMyReply(post)) {
      return false;
    }

    if (selectedFeedType !== 'all' && post.postType !== selectedFeedType) return false;

    return true;
  });

  const activeDetailPost = posts.find((p) => p.id === selectedPostId) || null;

  const filteredPlacesForThread = useMemo(() => {
    if (!placeSearchQuery.trim()) return allPlaces.slice(0, 8);
    const q = placeSearchQuery.toLowerCase();
    return allPlaces.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.location && p.location.toLowerCase().includes(q)) ||
        (p.address && p.address.toLowerCase().includes(q))
    );
  }, [placeSearchQuery, allPlaces]);

  const selectedThreadPlaceObj = allPlaces.find((p) => p.id === newThreadPlaceId) || null;

  const filteredPlacesForReply = useMemo(() => {
    if (!replyPlaceSearchQuery.trim()) return allPlaces.slice(0, 8);
    const q = replyPlaceSearchQuery.toLowerCase();
    return allPlaces.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.location && p.location.toLowerCase().includes(q)) ||
        (p.address && p.address.toLowerCase().includes(q))
    );
  }, [replyPlaceSearchQuery, allPlaces]);

  const selectedReplyPlaceObj = allPlaces.find((p) => p.id === replyPlaceId) || null;

  const handleToggleLike = (postId, e) => {
    if (e) e.stopPropagation();
    api.toggleLikePost(postId, currentUserId).catch(() => {});
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const nextLiked = !post.isLiked;
          const currentCount = Number(post.likesCount || post.likes || 0);
          return {
            ...post,
            isLiked: nextLiked,
            liked: nextLiked,
            likes: nextLiked ? currentCount + 1 : Math.max(0, currentCount - 1),
            likesCount: nextLiked ? currentCount + 1 : Math.max(0, currentCount - 1),
          };
        }
        return post;
      })
    );
  };

  const handleOpenPostDetail = (postId) => {
    lastScrollPosition.current = window.scrollY;
    lastClickedPostId.current = postId;
    setSelectedPostId(postId);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToTimeline = () => {
    const savedY = lastScrollPosition.current;
    const prevPostId = lastClickedPostId.current;
    setSelectedPostId(null);
    setTimeout(() => {
      if (savedY > 0) {
        window.scrollTo({ top: savedY, behavior: 'instant' });
      } else if (prevPostId) {
        const el = document.getElementById(`post-${prevPostId}`);
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      }
    }, 10);
  };

  const handleOpenReplyModal = (
    post,
    e,
    targetComment = null,
    replyToAuthor = null
  ) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setReplyModalPost(post);
    if (targetComment) {
      setReplyTargetComment({
        commentId: targetComment.id,
        replyToAuthor: replyToAuthor || targetComment.author,
        snippet: targetComment.text,
      });
    } else {
      setReplyTargetComment(null);
    }
    setReplyText('');
    setReplyPlaceId('');
    setReplyPlaceSearchQuery('');
    setIsReplyPlaceSearchOpen(false);
    setReplyImagePreview('');
    setIsReplyDragOver(false);
    if (replyFileInputRef.current) replyFileInputRef.current.value = '';
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !replyModalPost) return;

    const taggedPlaceObj = replyPlaceId
      ? allPlaces.find((p) => p.id === replyPlaceId) || null
      : null;

    const authorDisplayName = currentUserName ? `${currentUserName} (Kamu)` : 'Kamu';

    api.addPostComment(replyModalPost.id, {
      author: currentUserName || 'Kamu',
      userId: currentUserId,
      text: replyText.trim(),
      parentId: replyTargetComment ? replyTargetComment.commentId : null,
    }).catch(() => {});

    if (replyTargetComment) {
      const newReply = {
        id: Date.now(),
        author: authorDisplayName,
        userId: currentUserId,
        badge: currentUser?.role === 'owner' ? BADGES.owner : BADGES.nugas,
        replyToAuthor: replyTargetComment.replyToAuthor,
        text: replyText.trim(),
        imageUrl: replyImagePreview.trim() || null,
        taggedPlace: taggedPlaceObj,
        time: 'Baru saja',
      };

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === replyModalPost.id) {
            return {
              ...post,
              comments: post.comments.map((comment) => {
                if (comment.id === replyTargetComment.commentId) {
                  return {
                    ...comment,
                    replies: [...(comment.replies || []), newReply],
                  };
                }
                return comment;
              }),
            };
          }
          return post;
        })
      );
      showToast(
        `Balasan untuk @${replyTargetComment.replyToAuthor} berhasil dikirim! 💬`
      );
    } else {
      const newComment = {
        id: Date.now(),
        author: authorDisplayName,
        userId: currentUserId,
        badge: currentUser?.role === 'owner' ? BADGES.owner : BADGES.nugas,
        text: replyText.trim(),
        imageUrl: replyImagePreview.trim() || null,
        taggedPlace: taggedPlaceObj,
        time: 'Baru saja',
        replies: [],
      };

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === replyModalPost.id) {
            return {
              ...post,
              comments: [...post.comments, newComment],
            };
          }
          return post;
        })
      );
      showToast('Balasan berhasil dikirim! 💬');
    }

    setReplyModalPost(null);
    setReplyTargetComment(null);
    setReplyText('');
    setReplyImagePreview('');
    setReplyPlaceId('');
  };

  const handleSubmitInlineReply = (commentId, replyToAuthor) => {
    if (!inlineReplyText.trim() || !activeDetailPost) return;

    const authorDisplayName = currentUserName ? `${currentUserName} (Kamu)` : 'Kamu';

    api.addPostComment(activeDetailPost.id, {
      author: currentUserName || 'Kamu',
      userId: currentUserId,
      text: inlineReplyText.trim(),
      parentId: commentId,
    }).catch(() => {});

    const newReply = {
      id: Date.now(),
      author: authorDisplayName,
      userId: currentUserId,
      badge: currentUser?.role === 'owner' ? BADGES.owner : BADGES.nugas,
      replyToAuthor: replyToAuthor,
      text: inlineReplyText.trim(),
      imageUrl: null,
      taggedPlace: null,
      time: 'Baru saja',
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === activeDetailPost.id) {
          return {
            ...post,
            comments: post.comments.map((comment) => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  replies: [...(comment.replies || []), newReply],
                };
              }
              return comment;
            }),
          };
        }
        return post;
      })
    );

    setInlineReplyTarget(null);
    setInlineReplyText('');
    showToast(`Balasan untuk @${replyToAuthor} berhasil dikirim! 💬`);
  };

  const handleCreateThreadSubmit = (e) => {
    e.preventDefault();
    if (!newThreadContent.trim()) {
      alert('Harap tulis konten utas!');
      return;
    }

    const placeObj = newThreadPlaceId
      ? allPlaces.find((p) => p.id === newThreadPlaceId) || null
      : null;

    const tempId = `local-${Date.now()}`;
    const newPost = {
      id: tempId,
      userId: currentUserId,
      postType: 'thread',
      author: {
        id: currentUserId,
        userId: currentUserId,
        name: currentUserName,
        initials: currentUserInitials,
        campus: currentUserCampus,
        avatarBg: 'bg-primary-container',
        badge: BADGES.sepuh,
        isMe: true,
      },
      timeAgo: 'Baru saja',
      content: newThreadContent.trim(),
      imageUrl: uploadedImagePreview.trim() || null,
      taggedPlace: placeObj,
      category: newThreadCategory || 'nongkrong',
      circleType: 'public',
      likesCount: 0,
      isLiked: false,
      comments: [],
    };

    api.createPost({
      userId: currentUserId,
      content: newThreadContent.trim(),
      image: uploadedImagePreview.trim() || null,
      imageUrl: uploadedImagePreview.trim() || null,
      cafeTag: placeObj ? placeObj.name : undefined,
      placeId: placeObj ? placeObj.id : undefined,
      category: newThreadCategory || 'nongkrong',
      authorName: currentUserName,
      authorCampus: currentUserCampus,
      postType: 'thread',
    }).then((created) => {
      if (created && created.id) {
        setPosts((prev) => prev.map((p) => (p.id === tempId ? { ...p, id: created.id } : p)));
      }
    }).catch(() => {});

    setPosts([newPost, ...posts]);
    setShowThreadModal(false);
    setNewThreadContent('');
    setNewThreadPlaceId('');
    setPlaceSearchQuery('');
    setNewThreadCategory('');
    setUploadedImagePreview('');
    if (threadFileInputRef.current) threadFileInputRef.current.value = '';
    showToast('+10 XP didapatkan! 🎉 Utas diskusi berhasil diterbitkan.');
  };

  const handleTriggerAppModal = (reason = 'invite', e) => {
    if (e) e.stopPropagation();
    setAcquisitionReason(reason);
    setShowAppAcquisitionModal(true);
  };

  const handleToggleHangoutClosed = (postId, e) => {
    if (e) e.stopPropagation();
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const nextClosed = !post.isClosed;
          showToast(
            nextClosed
              ? 'Ajakan ditandai PENUH. Pendaftaran ditutup!'
              : 'Ajakan dibuka kembali untuk teman baru!'
          );
          return { ...post, isClosed: nextClosed };
        }
        return post;
      })
    );
  };

  return (
    <div className="w-full bg-surface min-h-screen text-on-surface antialiased flex flex-col selection:bg-primary-container selection:text-on-primary-fixed relative">
      {toastMessage && (
        <div className="fixed bottom-8 left-6 md:left-8 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 border border-border-hairline">
          <span className="material-symbols-outlined text-primary-container text-[20px]">
            check_circle
          </span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {selectedPostId !== null && activeDetailPost ? (
        <FeedDetailView
          activeDetailPost={activeDetailPost}
          onNavigate={onNavigate}
          onBackToTimeline={handleBackToTimeline}
          onOpenReplyModal={handleOpenReplyModal}
          onToggleLike={handleToggleLike}
          onSelectPlace={onSelectPlace}
          showToast={showToast}
          inlineReplyTarget={inlineReplyTarget}
          setInlineReplyTarget={setInlineReplyTarget}
          inlineReplyText={inlineReplyText}
          setInlineReplyText={setInlineReplyText}
          onSubmitInlineReply={handleSubmitInlineReply}
        />
      ) : (
        <div className="max-w-[1280px] w-full mx-auto px-4 md:px-8 py-6 md:py-10 flex flex-col gap-6">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-charcoal-subtle font-medium"
          >
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('beranda')}
              className="hover:text-on-surface transition-colors cursor-pointer"
            >
              Beranda
            </button>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface font-semibold">Komunitas</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-bold">Feeds &amp; Ajak Nongkrong</span>
          </nav>

          <div className="w-full flex flex-col lg:flex-row gap-6 items-start">
            <FeedLeftSidebar
              onOpenThreadModal={() => setShowThreadModal(true)}
              onTriggerAppModal={handleTriggerAppModal}
              selectedFeedTab={selectedFeedTab}
              onSelectFeedTab={(tab) => {
                setSelectedFeedTab(tab);
                if (tab === 'all' || tab === 'my_threads') {
                  setSelectedFeedType('all');
                }
              }}
              totalPostsCount={posts.length}
              myThreadsCount={myThreadsCount}
              likedPostsCount={likedPostsCount}
              myRepliesCount={myRepliesCount}
              currentUserName={currentUserName}
              currentUserRole={currentUserRole}
              currentUserCampus={currentUserCampus}
              currentUserInitials={currentUserInitials}
            />

            <div className="flex-1 min-w-0 flex flex-col gap-5">
              <div className="sticky top-20 z-20 bg-surface/90 backdrop-blur-md py-1">
                <div className="w-full bg-surface-card rounded-2xl p-1.5 shadow-xs border border-border-hairline">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 w-full bg-surface-container-low p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setSelectedFeedType('all')}
                      className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        selectedFeedType === 'all'
                          ? 'bg-surface-card text-on-surface shadow-xs font-extrabold'
                          : 'text-charcoal-subtle hover:text-on-surface hover:bg-surface-card/50'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">dynamic_feed</span>
                      <span>Semua Linimasa</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedFeedType('thread')}
                      className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        selectedFeedType === 'thread'
                          ? 'bg-surface-card text-on-surface shadow-xs font-extrabold'
                          : 'text-charcoal-subtle hover:text-on-surface hover:bg-surface-card/50'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">chat_bubble</span>
                      <span className="truncate">Utas &amp; Review</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedFeedType('hangout')}
                      className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        selectedFeedType === 'hangout'
                          ? 'bg-surface-card text-on-surface shadow-xs font-extrabold'
                          : 'text-charcoal-subtle hover:text-on-surface hover:bg-surface-card/50'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px] text-primary">groups</span>
                      <span className="truncate">Ajak Nongkrong</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary-container text-on-primary-fixed uppercase tracking-wider">
                        Mobile
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                {isLoading ? (
                  <div className="flex flex-col gap-4">
                    {[1, 2, 3].map((n) => (
                      <div
                        key={n}
                        className="p-5 md:p-6 rounded-3xl bg-surface-card border border-border-hairline animate-pulse flex flex-col gap-4 shadow-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-surface-container" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-surface-container rounded-md w-1/4" />
                            <div className="h-3 bg-surface-container rounded-md w-1/3" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 bg-surface-container rounded-md w-11/12" />
                          <div className="h-4 bg-surface-container rounded-md w-4/5" />
                          <div className="h-4 bg-surface-container rounded-md w-3/5" />
                        </div>
                        <div className="h-10 bg-surface-container rounded-2xl w-full mt-1" />
                        <div className="flex items-center gap-4 pt-2 border-t border-border-hairline">
                          <div className="h-5 bg-surface-container rounded-md w-16" />
                          <div className="h-5 bg-surface-container rounded-md w-16" />
                          <div className="h-5 bg-surface-container rounded-md w-16" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : feedError ? (
                  <div className="p-12 text-center bg-surface-card rounded-3xl border border-dashed border-error/40 flex flex-col items-center gap-3 shadow-xs">
                    <div className="w-14 h-14 rounded-2xl bg-error/10 text-error flex items-center justify-center mb-1">
                      <span className="material-symbols-outlined text-[32px]">wifi_off</span>
                    </div>
                    <h3 className="font-bold text-base text-on-surface">Oops! Terjadi Kesalahan</h3>
                    <p className="text-xs text-charcoal-subtle max-w-sm leading-relaxed">
                      {feedError}
                    </p>
                    <button
                      type="button"
                      onClick={loadPosts}
                      className="mt-2 px-5 py-2.5 rounded-xl bg-primary-container text-on-primary-fixed hover:bg-accent-hover font-bold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[16px]">refresh</span>
                      <span>Coba Lagi</span>
                    </button>
                  </div>
                ) : filteredPosts.length === 0 ? (
                  <div className="p-12 text-center bg-surface-card rounded-3xl border border-border-hairline flex flex-col items-center gap-3">
                    <span className="material-symbols-outlined text-[48px] text-charcoal-subtle">
                      {selectedFeedTab === 'my_threads' ? 'edit_note' : 'post_add'}
                    </span>
                    <h3 className="font-bold text-base text-on-surface">
                      {selectedFeedTab === 'my_threads'
                        ? 'Belum ada utas yang kamu buat'
                        : 'Belum ada postingan untuk filter ini'}
                    </h3>
                    <p className="text-xs text-charcoal-subtle max-w-sm">
                      {selectedFeedTab === 'my_threads'
                        ? 'Mulai berbagi ulasan spot nongkrong, info colokan & Wi-Fi, atau tanya rekomendasi kafe ke teman mahasiswa!'
                        : 'Jadilah yang pertama menuliskan utas diskusi atau ulasan spot kafe favoritmu!'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowThreadModal(true)}
                      className="mt-2 px-4 py-2 rounded-xl bg-primary-container hover:bg-accent-hover text-on-primary-fixed font-bold text-xs transition-colors cursor-pointer shadow-xs"
                    >
                      Tulis Utas Sekarang (+10 XP)
                    </button>
                  </div>
                ) : (
                  filteredPosts.map((post) => (
                    <FeedPostCard
                      key={post.id}
                      post={post}
                      onOpenPostDetail={handleOpenPostDetail}
                      onOpenReplyModal={handleOpenReplyModal}
                      onToggleLike={handleToggleLike}
                      onToggleHangoutClosed={handleToggleHangoutClosed}
                      onSelectPlace={onSelectPlace}
                      onNavigate={onNavigate}
                    />
                  ))
                )}
              </div>
            </div>

            <FeedRightSidebar
              feedSearchQuery={feedSearchQuery}
              onSearchChange={setFeedSearchQuery}
              popularPlacesList={popularPlacesList}
              partnerPlacesList={partnerPlacesList}
              onSelectPlace={onSelectPlace}
              onNavigate={onNavigate}
              rightCardsRef={rightCardsRef}
            />
          </div>
        </div>
      )}

      <ReplyModal
        replyModalPost={replyModalPost}
        replyTargetComment={replyTargetComment}
        replyText={replyText}
        setReplyText={setReplyText}
        replyPlaceId={replyPlaceId}
        setReplyPlaceId={setReplyPlaceId}
        replyPlaceSearchQuery={replyPlaceSearchQuery}
        setReplyPlaceSearchQuery={setReplyPlaceSearchQuery}
        isReplyPlaceSearchOpen={isReplyPlaceSearchOpen}
        setIsReplyPlaceSearchOpen={setIsReplyPlaceSearchOpen}
        selectedReplyPlaceObj={selectedReplyPlaceObj}
        filteredPlacesForReply={filteredPlacesForReply}
        replyFileInputRef={replyFileInputRef}
        replyImagePreview={replyImagePreview}
        setReplyImagePreview={setReplyImagePreview}
        isReplyDragOver={isReplyDragOver}
        setIsReplyDragOver={setIsReplyDragOver}
        processImageFile={processImageFile}
        handleReplySubmit={handleReplySubmit}
        onClose={() => {
          setReplyModalPost(null);
          setReplyTargetComment(null);
          setIsReplyPlaceSearchOpen(false);
        }}
      />

      <CreateThreadModal
        isOpen={showThreadModal}
        onClose={() => {
          setShowThreadModal(false);
          setIsPlaceSearchOpen(false);
        }}
        newThreadContent={newThreadContent}
        setNewThreadContent={setNewThreadContent}
        newThreadPlaceId={newThreadPlaceId}
        setNewThreadPlaceId={setNewThreadPlaceId}
        placeSearchQuery={placeSearchQuery}
        setPlaceSearchQuery={setPlaceSearchQuery}
        isPlaceSearchOpen={isPlaceSearchOpen}
        setIsPlaceSearchOpen={setIsPlaceSearchOpen}
        selectedThreadPlaceObj={selectedThreadPlaceObj}
        filteredPlacesForThread={filteredPlacesForThread}
        newThreadCategory={newThreadCategory}
        setNewThreadCategory={setNewThreadCategory}
        threadFileInputRef={threadFileInputRef}
        uploadedImagePreview={uploadedImagePreview}
        setUploadedImagePreview={setUploadedImagePreview}
        isThreadDragOver={isThreadDragOver}
        setIsThreadDragOver={setIsThreadDragOver}
        processImageFile={processImageFile}
        handleCreateThreadSubmit={handleCreateThreadSubmit}
      />

      <WebAcquisitionModal
        isOpen={showAppAcquisitionModal}
        onClose={() => setShowAppAcquisitionModal(false)}
        acquisitionReason={acquisitionReason}
        onDownloadApk={() => {
          showToast('Memulai unduh pNongki-app-v2.0.apk...');
          setShowAppAcquisitionModal(false);
        }}
      />
    </div>
  );
}
