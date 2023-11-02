<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id') // 紐づけ先がBigIncrements型の場合のみに使用可能
                ->constrained() //テーブルが異なる場合は引数に指定
                ->cascadeOnDelete() //紐づけ先が削除された場合の動作
                ->cascadeOnUpdate(); // 紐づけ先が更新された場合の動作
            $table->string('title');
            $table->string('body');
            $table->string('start');
            $table->string('end');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
