import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import S from './style';
import postApi from '../api/postlist';

interface Post {
  postId: number;
  username: string;
  title: string;
  content: string;
  createdAt: string;
  count: number;
}

interface SearchResponse {
  content: Post[];
  totalElements: number;
}

const Search: React.FC = () => {
  const location = useLocation();

  const [keyword, setKeyword] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const postsPerPage = 8;

  const totalPages = Math.ceil(totalCount / postsPerPage);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const newKeyword = queryParams.get('keyword') || '';
    setKeyword(newKeyword);
    setCurrentPage(1);
    console.log('🔁 keyword set from URL:', newKeyword);
  }, [location.search]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const savedNickname = localStorage.getItem('username');
    if (token) {
      setIsLoggedIn(true);
      setNickname(savedNickname || '사용자');
    }
  }, []);

  useEffect(() => {
    const fetchSearchedPosts = async () => {
      if (!keyword || currentPage < 1) return;

      try {
        console.log('[검색 요청]', {
          keyword,
          currentPage,
          backendPage: currentPage - 1,
        });

        const data: SearchResponse = await postApi.search(keyword, currentPage - 1);
        setPosts(data.content);
        setTotalCount(data.totalElements);
      } catch (err) {
        const error = err as Error;
        console.error('[검색 실패]', error.message);
        console.error('[에러 정보]', error);
      }
    };

    fetchSearchedPosts();
  }, [keyword, currentPage]);

  const goToPage = (page: number) => {
    if (page === currentPage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <S.MainWrapper>
      <S.ContentLeft>
        <h3>검색된 글</h3>
        <S.TotalCount>전체 게시글: {totalCount}</S.TotalCount>

        <S.PostListWrapper>
          {posts.length > 0 ? (
            posts.map((post) => (
              <S.PostCard key={post.postId}>
                <div className="post-header">
                  <div className="author-icon" />
                  <span>{post.username}</span>
                  <div className="divider" />
                  <span>{post.createdAt.split('T')[0]}</span>
                  <div className="divider" />
                  <span>👁 {post.count}</span>
                </div>
                <h3 className="title">{post.title}</h3>
                <p className="content">{post.content}</p>
              </S.PostCard>
            ))
          ) : (
            <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
              게시물이 없습니다.
            </p>
          )}
        </S.PostListWrapper>

        {posts.length > 0 && (
          <S.Pagination>
            <button onClick={() => goToPage(1)}>{'<<'}</button>
            <button onClick={() => goToPage(Math.max(currentPage - 1, 1))}>{'<'}</button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => goToPage(i + 1)}
                style={{
                  fontWeight: currentPage === i + 1 ? 'bold' : 'normal',
                  color: currentPage === i + 1 ? 'red' : 'black',
                }}
              >
                {i + 1}
              </button>
            ))}

            <button onClick={() => goToPage(Math.min(currentPage + 1, totalPages))}>{'>'}</button>
            <button onClick={() => goToPage(totalPages)}>{'>>'}</button>
          </S.Pagination>
        )}
      </S.ContentLeft>

      {isLoggedIn && (
        <S.SidebarRight>
          <S.UserAvatar />
          <S.Nickname>{nickname}</S.Nickname>
          <div>
            <S.ActionButton>글쓰기</S.ActionButton>
            <S.ActionButton>마이페이지</S.ActionButton>
          </div>
        </S.SidebarRight>
      )}
    </S.MainWrapper>
  );
};

export default Search;
