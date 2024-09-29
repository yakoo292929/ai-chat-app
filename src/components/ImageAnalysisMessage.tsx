/**
 * ===========================================================================================
 * SYSTEM NAME    : ai-chart-app
 * PROGRAM ID     : src/components/ImageAnalysisMessage.tsx
 * PROGRAM NAME   : ImageAnalysisMessage.tsx
 *                : 画像解析メッセージ
 * DEVELOPED BY   : yamabakery
 * CREATE DATE    : 2024/09/01
 * CREATE AUTHOR  : yakoo292929
 * ===========================================================================================
**/

import React from "react";
import { Card } from "./ui/card";
import Image from "next/image";
import TextMessage from "./TextMessage";

const ImageAnalysisMessage = ({content}: {content: { imageUrl: string[], text: string } }) => {

  /////////////////////////////////////////////
  // 画面表示
  /////////////////////////////////////////////
  return (

    <div>
      {content.imageUrl.length > 0 && (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mb-4">
          {content.imageUrl.map((url) => (
            <Card key={url} className="rounded-lg overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  fill
                  src={url}
                  alt="Uploaded Image"
                  className="object-cover"
                  priority
                  sizes="(max-width: 767px) 100vw, (min-width: 768px) and (max-width: 1023px) 50vw, (min-width: 1024px) and (max-width: 1279px) 33.33vw, (min-width: 1280px) and (max-width: 1535px) 25vw, (min-width: 1536px) 20vw"
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* テキスト */}
      {content.text && (
        <div className="inline-block">
          <TextMessage content={content.text} />
        </div>
      )}

    </div>
    
  );

};

export default ImageAnalysisMessage;

