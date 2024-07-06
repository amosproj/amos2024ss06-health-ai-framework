
// import { useState, useEffect, useCallback } from 'react';
// import * as WebBrowser from 'expo-web-browser';
// import * as Google from 'expo-auth-session/providers/google';
// import type { TokenResponse } from 'expo-auth-session';
// //TODO: delete unnecessary imports from yarn

// import axios from 'axios';
// import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

// // // TODO: replace this with proper OAUTH2 data


// GoogleSignin.configure({
//   scopes: ['https://www.googleapis.com/auth/documents.readonly'],
//   webClientId: CLIENT_ID,
//   offlineAccess: true,
// });

// export function useGoogleDocsContent(docId: string)
// {
//   const [content, setContent] = useState<string | undefined>(undefined);
//   const [docsError, setError] = useState<Error | undefined>(undefined);

//   useEffect(() => {
//     async function main() {
//       const token = await signIn();
//       if (token) {
//         const documentId = '1xrfrwyRCTrxiCupiKSSFgKUxiCTXgr45gPJYybnY23w';
//         const documentContent = await fetchDocumentContent(documentId, token);
//         if (documentContent) {
//           const textContent = parseDocumentContent(documentContent);
//           setContent(textContent);
//         }
//       }
//     }
//     main();
//   }, []);

//   async function signIn() {
//     try {
//       await GoogleSignin.hasPlayServices();
//       const userInfo = await GoogleSignin.signIn();
//       const { idToken } = userInfo;
//       const tokens = await GoogleSignin.getTokens();
//       return tokens.accessToken;
//     } catch (error) {
//       setError(error instanceof Error ? error : new Error('Google docs signin failed'));
//     }
//   }

//   async function fetchDocumentContent(documentId: string, token: string) {
//     try {
//       const response = await axios.get(`https://docs.googleapis.com/v1/documents/${documentId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       return response.data;
//     } catch (error) {
//       setError(error instanceof Error ? error : new Error('Fetching Google Docs content failed'));
//     }
//   }

//   function parseDocumentContent(content: any) {
//     const body = content.body?.content || [];
//     const text = body.flatMap((element: any) =>
//       element.paragraph?.elements?.map((el: any) => el.textRun?.content || '')
//     ).join('');
//     return text;
//   }

//   // useEffect(() => {
//   //   const fetchDocument = async () => {
//   //     try {
//   //       const response = await axios.get(
//   //         'https://www.googleapis.com/drive/v3/files/' + docId + '/export?mimeType=text/html',
//   //         {
//   //           headers: {
//   //             Authorization: `Bearer ${CLIENT_SECRET}`,
//   //           },
//   //         }
//   //       );
//   //       setContent(response.data);
//   //     } catch (error) {
//   //       console.error('Error fetching Google Document:', error);
//   //     }
//   //   };
//   //   fetchDocument();
//   // }, []);


//   return { content, docsError };
// }

// // export function useGoogleDocsContent(docId: string) {

// //   const [content, setContent] = useState<string | undefined>(undefined);
// //   const [docsError, setError] = useState<Error | undefined>(undefined);


// //   const [request, response, promptAsync] = Google.useAuthRequest({
// //     clientId: CLIENT_ID,
// //     clientSecret: CLIENT_SECRET,
// //     scopes: ['https://www.googleapis.com/auth/documents.readonly'],
// //   });
// //   console.log(request)
// //   console.log(response)

// //   const fetchContent = useCallback(async (accessToken: string) => {
// //     try {
// //       const response = await fetch(
// //         `https://docs.googleapis.com/v1/documents/${docId}`,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${accessToken}`,
// //           },
// //         }
// //       );

// //       if (!response.ok) {
// //         throw new Error('Failed to fetch document');
// //       }

// //       const data = await response.json();
// //       const textContent = extractTextContent(data);
// //       setContent(textContent);
// //     } catch (err) {
// //       setError(err instanceof Error ? err : new Error('An error occurred'));
// //     }
// //   }, [docId]);

// //   useEffect(() => {
// //     if (response?.type === 'success') {
// //       try {
// //         const tokenResponse = response.authentication as TokenResponse;
// //         const accessToken = tokenResponse.accessToken;

// //         if (accessToken) {
// //           fetchContent(accessToken);

// //           // Set up interval to fetch every minute
// //           const interval = setInterval(() => fetchContent(accessToken), 60000);
// //           return () => clearInterval(interval);
// //         }
// //       } catch (err) {
// //         setError(err instanceof Error ? err : new Error('Could not fetch document'));
// //       }

// //     }
// //   }, [response, fetchContent]);

// //   // useEffect(() => {
// //   //   const fetchContent = async () => {
// //   //     if (!accessToken) return;

// //   //     try {
// //   //       const response = await fetch(
// //   //         `https://docs.googleapis.com/v1/documents/${docId}`,
// //   //         {
// //   //           headers: {
// //   //             Authorization: `Bearer ${accessToken}`,
// //   //           },
// //   //         }
// //   //       );

// //   //       if (!response.ok) {
// //   //         throw new Error('Failed to fetch document');
// //   //       }

// //   //       const data = await response.json();
// //   //       const textContent = extractTextContent(data);
// //   //       setContent(textContent);
// //   //     } catch (err) {
// //   //       setError(err instanceof Error ? err : new Error('An error occurred'));
// //   //     }
// //   //   };

// //   //   if (accessToken) {
// //   //     fetchContent();
// //   //     const interval = setInterval(fetchContent, 60000);
// //   //     return () => clearInterval(interval);
// //   //   }
// //   // }, [accessToken, docId]);

// //   // biome-ignore lint/suspicious/noExplicitAny:
// //   const extractTextContent = (document: any): string => {
// //     let text = '';
// //     try {
// //       const content = document.body.content;
// //       for (const element of content) {
// //         if (element.paragraph) {
// //           for (const paragraphElement of element.paragraph.elements) {
// //             if (paragraphElement.textRun) {
// //               text += paragraphElement.textRun.content;
// //             }
// //           }
// //         }
// //       }
// //     } catch (err) {
// //       setError(new Error('Failed to extract text content'));
// //     }
// //     return text;
// //   };

// //   return { content, docsError };
// // };
