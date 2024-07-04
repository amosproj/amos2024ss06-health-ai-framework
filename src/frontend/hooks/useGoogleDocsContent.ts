
// import { useState, useEffect, useCallback } from 'react';
// import * as WebBrowser from 'expo-web-browser';
// import * as Google from 'expo-auth-session/providers/google';
// import type { TokenResponse } from 'expo-auth-session';

// // TODO: replace this with proper OAUTH2 data

// export function useGoogleDocsContent(docId: string) {

//   const [content, setContent] = useState<string | undefined>(undefined);
//   const [docsError, setError] = useState<Error | undefined>(undefined);


//   const [request, response, promptAsync] = Google.useAuthRequest({
//     clientId: CLIENT_ID,
//     clientSecret: CLIENT_SECRET,
//     scopes: ['https://www.googleapis.com/auth/documents.readonly'],
//   });

//   const fetchContent = useCallback(async (accessToken: string) => {
//     try {
//       const response = await fetch(
//         `https://docs.googleapis.com/v1/documents/${docId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Failed to fetch document');
//       }

//       const data = await response.json();
//       const textContent = extractTextContent(data);
//       setContent(textContent);
//     } catch (err) {
//       setError(err instanceof Error ? err : new Error('An error occurred'));
//     }
//   }, [docId]);

//   useEffect(() => {
//     if (response?.type === 'success') {
//       try {
//         const tokenResponse = response.authentication as TokenResponse;
//         const accessToken = tokenResponse.accessToken;

//         if (accessToken) {
//           fetchContent(accessToken);

//           // Set up interval to fetch every minute
//           const interval = setInterval(() => fetchContent(accessToken), 60000);
//           return () => clearInterval(interval);
//         }
//       } catch (err) {
//         setError(err instanceof Error ? err : new Error('Could not fetch document'));
//       }

//     }
//   }, [response, fetchContent]);

//   // useEffect(() => {
//   //   const fetchContent = async () => {
//   //     if (!accessToken) return;

//   //     try {
//   //       const response = await fetch(
//   //         `https://docs.googleapis.com/v1/documents/${docId}`,
//   //         {
//   //           headers: {
//   //             Authorization: `Bearer ${accessToken}`,
//   //           },
//   //         }
//   //       );

//   //       if (!response.ok) {
//   //         throw new Error('Failed to fetch document');
//   //       }

//   //       const data = await response.json();
//   //       const textContent = extractTextContent(data);
//   //       setContent(textContent);
//   //     } catch (err) {
//   //       setError(err instanceof Error ? err : new Error('An error occurred'));
//   //     }
//   //   };

//   //   if (accessToken) {
//   //     fetchContent();
//   //     const interval = setInterval(fetchContent, 60000);
//   //     return () => clearInterval(interval);
//   //   }
//   // }, [accessToken, docId]);

//   // biome-ignore lint/suspicious/noExplicitAny:
//   const extractTextContent = (document: any): string => {
//     let text = '';
//     try {
//       const content = document.body.content;
//       for (const element of content) {
//         if (element.paragraph) {
//           for (const paragraphElement of element.paragraph.elements) {
//             if (paragraphElement.textRun) {
//               text += paragraphElement.textRun.content;
//             }
//           }
//         }
//       }
//     } catch (err) {
//       setError(new Error('Failed to extract text content'));
//     }
//     return text;
//   };

//   return { content, docsError };
// };
