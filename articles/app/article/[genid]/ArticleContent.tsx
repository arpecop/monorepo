'use client';

import CommentSection from '@/app/components/CommentSection';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

export default function ArticleContent({ genid }: { genid: string }) {
  useEffect(() => {
    // Store the article ID in a cookie when the page loads
    Cookies.set('redirect_article_id', genid, { expires: 1 }); // expires in 1 day
  }, [genid]);

  return <CommentSection genid={genid} />;
}
